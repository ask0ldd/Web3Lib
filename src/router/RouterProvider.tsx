/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import React from "react";
import Route from './Route';
import { RouterContext } from "./RouterContext";

export function RouterProvider({ children, base = '' }: { children: ReactNode, base? : string }){

    console.log("router refresh")

    // the element that needs to be displayed according to the active path
    const [activeChild, setActiveChild] = useState<ReactNode>(<></>)
    const params = useRef<Record<string, string>>({})

    // convert all the Route child components into a {path, element} object
    // !!! add try catch
    const routing = useMemo(() => {
        return React.Children.map(children, (child) => {
            if (React.isValidElement<React.ComponentProps<typeof Route>>(child) && child.type === Route) {

                // fallback
                if(child.props.path == "*") return ({
                    path : '*',
                    pathMatchingRegex : new RegExp('(?s:.*)'),
                    paramsKeys : [],
                    element: child.props.element 
                })

                const path = base + child.props.path.replace(/\/$/, "") // getting rid of trailing "/""
                const paramsKeys = extractParams(path)
                const pathMatchingRegex = paramsKeys.length == 0 ? 
                    new RegExp(`^${path}$`) : 
                        // replace /: with the same number of /[^/]+ so it can be compared to the active url
                        new RegExp(`^${path}`.replace(/\/:[^/]+(?=\/|$)/g, (match) => match.endsWith('/') ? `(/[^/]+)` + '/' : `(/[^/]+)`) + '$')
                return ({ 
                    path,
                    pathMatchingRegex,
                    paramsKeys,
                    element: child.props.element 
                })
            }
            throw new Error(`All children of Router must be Route components.`)
        })
    }, [children])

    // history.pushState now sends a pushstate event
    const pushStateReplaced = useRef<boolean>(false)
    useEffect(() => {
        if(pushStateReplaced.current) return
        const originalPushState = history.pushState
        history.pushState = function(...args) {
            originalPushState.apply(this, args)
            window.dispatchEvent(new Event('pushstate'))
        }
        pushStateReplaced.current = true
    }, [])

    const getHistorySnapshot = useCallback(() => {
        return window.location.href.replace(/\/$/, "")
    }, [])

    const subscribe = useCallback((callback : () => void) => {
        window.addEventListener('popstate', callback)
        window.addEventListener('pushstate', callback)
        return () => {
          window.removeEventListener('popstate', callback)
          window.removeEventListener('pushstate', callback)
        }
    }, [])

    const historyState = useSyncExternalStore(
        subscribe, 
        getHistorySnapshot
    )

    useEffect(() => {
        console.log('historyState effect')

        function handleMatchingRoute(route : IRoute, historyState : string){
            const nExpectedParams = route.paramsKeys.length
            if(nExpectedParams > 0) {
                const extractedParams = historyState.split('/').slice(-nExpectedParams)
                if(extractedParams.length != nExpectedParams) throw new Error(`Expected ${nExpectedParams} params, but got ${extractedParams.length}`)
                params.current = Object.fromEntries(route.paramsKeys.map((key, index) => [key, extractedParams[index]]))
            }
            if(!Object.is(activeChild, route.element)) setActiveChild(route.element)
        }

        try{
            // const historyPathname = new URL(historyState).pathname
            const activeRoute = routing?.find(route => historyState.match(route.pathMatchingRegex))
            if(activeRoute) return handleMatchingRoute(activeRoute, historyState)

            const defaultRoute = routing?.find(route => route.path == '*')
            if(defaultRoute) handleMatchingRoute(defaultRoute, historyState)
        } catch(error){
            console.error(error)
        }
        // !!! throw if no matching route or default 404?
    }, [historyState])

    // programmatical navigation
    const navigate = useCallback((path : string) =>{
        history.pushState(null, '', path)
    }, [])

    // retrieve params
    const getParams = useCallback(() => {
        return params.current
    }, [params.current])

    return (
        <RouterContext value={{navigate, getParams}}>
            {activeChild}
        </RouterContext>
    )
}

function extractParams(url : string) {
    const regex = /\/:([\w-]+)/g;
    const matches = url.match(regex);
    
    if (!matches) {
      return [];
    }
    
    return matches.map(match => match.slice(2));
}

interface IRoute{
    path: string
    pathMatchingRegex: RegExp
    paramsKeys: string[]
    element: ReactNode
}

/*
const url = new URL('https://example.com/path/to/page?param1=value1&param2=value2');

console.log(url.protocol); // "https:"
console.log(url.hostname); // "example.com"
console.log(url.pathname); // "/path/to/page"
console.log(url.search);   // "?param1=value1&param2=value2"
// 
// */