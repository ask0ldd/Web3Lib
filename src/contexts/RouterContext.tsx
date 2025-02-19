import { createContext, ReactNode, useCallback, useEffect, useRef, useSyncExternalStore } from "react";

export const RouterContext = createContext<undefined>(undefined)

export function RouterProvider({ children }: { children: ReactNode }){

    const pushStateReplaced = useRef<boolean>(false)
    useEffect(() => {
        if(pushStateReplaced.current) return
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            window.dispatchEvent(new Event('pushstate'));
        };
        pushStateReplaced.current = true
    }, [])

    const getHistorySnapshot = useCallback(() => {
        return window.location.href;
    }, []);


    const historyState = useSyncExternalStore(
        subscribe, 
        getHistorySnapshot
    )

    function subscribe(callback : () => void){
        window.addEventListener('popstate', callback);
        window.addEventListener('pushstate', callback);
        return () => {
          window.removeEventListener('popstate', callback);
          window.removeEventListener('pushstate', callback);
        };
    }

    useEffect(() => {
        console.log("router")
    }, [historyState])

    return (
        <RouterContext value={undefined}>
            {children}
        </RouterContext>
    )
}