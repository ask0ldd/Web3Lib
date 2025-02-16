/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useSyncExternalStore } from "react";
import Store from "../store/Store";
import ObjectUtils from "../utils/ObjectUtils";

export default function useStore(){

    const storeRef = useRef<Store>(new Store())

    function subscribe(callback : () => void){
        if (!window) return () => {}
        const eventListener = () => callback()
        window.addEventListener("storeSetEvent", eventListener)
        return () => window.removeEventListener("storeSetEvent", eventListener)
    }

    const cachedStoreValuesRef = useRef({})
    function getStoreSnapshot() {
        const newStoreValues = storeRef.current.getStoreValues()
        if (ObjectUtils.shallowEqual(cachedStoreValuesRef.current, newStoreValues)) {
            return cachedStoreValuesRef.current
        }
        // Create a new reference to ensure React detects changes
        cachedStoreValuesRef.current = { ...newStoreValues }
        console.log(JSON.stringify(newStoreValues))
        return cachedStoreValuesRef.current
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
    // Memoizing the context value reduces the subsequent refreshes
    const storeContextValue = useMemo(
        () => ({
            state,
            store: storeRef.current,
        }),
        [cachedStoreValuesRef.current]
    )

    return storeContextValue
}