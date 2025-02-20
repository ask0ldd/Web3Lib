/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import App from "../App";
import React from "react";
import Route from '../components/Route';
import { RouterContext } from "./RouterContext";

export function RouterProvider({ children, base = '' }: { children: ReactNode, base? : string }){

    // the element that needs to be displayed according to the active path
    const [activeChild, setActiveChild] = useState<ReactNode>(<App/>)
    const [params, setParams] = useState<string[]>([])

    // convert all the Route child components into a {path, element} object
    const routing = useMemo(() => {
        return React.Children.map(children, (child) => {
            if (React.isValidElement<React.ComponentProps<typeof Route>>(child) && child.type === Route) {
                const path = base + child.props.path.replace(/\/$/, "")
                const params = extractParams(path)
                return ({ 
                    path,
                    regex: params.length == 0 ? 
                        new RegExp(`^${path}$`) : 
                            // !!! should deal with url accepting one param still responding positively to url with 2 params
                            new RegExp(`^${path}$`.replace(/\/:[^/]+(?=\/|$)/g, (match) => match.endsWith('/') ? '(/[^/]+)*' + '/' : '(/[^/]+)*')),
                    params,
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

    const historyState = useSyncExternalStore(
        subscribe, 
        getHistorySnapshot
    )

    function subscribe(callback : () => void){
        window.addEventListener('popstate', callback)
        window.addEventListener('pushstate', callback)
        return () => {
          window.removeEventListener('popstate', callback)
          window.removeEventListener('pushstate', callback)
        };
    }

    useEffect(() => {
        function handleMatchingRoute(route : IRoute, historyState : string){
            if(route.params.length > 0) {
                setParams(historyState.split('/').slice(-route.params.length))
            }
            return setActiveChild(route.element)
        }

        const activeRoute = routing?.find(route => historyState.match(route.regex))
        if(activeRoute) handleMatchingRoute(activeRoute, historyState)
        const defaultRoute = routing?.find(route => route.path == '*')
        if(defaultRoute) handleMatchingRoute(defaultRoute, historyState)
        // !!! throw if no matching route or default 404?
    }, [historyState])

    // programmatical navigation
    const navigate = useCallback((path : string) =>{
        // !!! check if path is valid
        history.pushState(null, '', path)
    }, [])

    // retrieve params
    const getParams = useCallback(() =>{
        return params
    }, [params])

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

// <Route path="/:param([0-9a-zA-Z-_~!$&'()*+,;=:@%]+)" component={YourComponent} />

interface IRoute{
    path: string;
    regex: RegExp;
    params: string[];
    element: ReactNode;
}