/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useSyncExternalStore } from "react";
import Store from "../../store/Store";
import ObjectUtils from "../../utils/ObjectUtils";

export default function useStore2(){

    const storeRef = useRef<Store>(new Store())

    function subscribe(callback : () => void){
        const eventListener = callback
        storeRef.current.addEventListener("storeSetEvent", eventListener)
        return () => storeRef.current.removeEventListener("storeSetEvent", eventListener)
    }

    const cachedStoreStateRef = useRef({})
    function getStoreSnapshot() {
        const newStoreState = storeRef.current.getState()
        if (ObjectUtils.shallowEqual(cachedStoreStateRef.current, newStoreState)) {
            return cachedStoreStateRef.current
        }
        // Create a new reference to ensure React detects changes
        cachedStoreStateRef.current = { ...newStoreState }
        return cachedStoreStateRef.current
    }

    // a callback is linked to an event through the subscribe method
    // when the event is triggered, the callback is executed
    // the execution of this callback leads to a snapshot being taken
    const state = useSyncExternalStore(
        subscribe, 
        getStoreSnapshot
    )

    // When the storeContextValue is updated, the context is refreshed
    // & as a consequence, the hook is reexecuted
    // Memoizing the context value reduces the number of refreshes
    const storeContextValue = useMemo(
        () => ({
            state,
            store : storeRef.current,
            // When you destructure setState from the context value, it becomes a standalone function, 
            // detached from its original object context. This means it no longer has access to the this context 
            // of the store object, which is crucial for its proper functioning
            setState : storeRef.current.setState.bind(storeRef.current),
            setSlice : storeRef.current.setSlice.bind(storeRef.current)
        })
    , [state])

    return storeContextValue
}