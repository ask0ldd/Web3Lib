/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useSyncExternalStore } from "react";
import Store from "../store/Store";
import ObjectUtils from "../utils/ObjectUtils";

export default function useStore(){

    const storeRef = useRef<Store>(new Store())

    function subscribe(callback : () => void){
        const eventListener = () => callback()
        storeRef.current.addEventListener("storeSetEvent", eventListener)
        return () => storeRef.current.removeEventListener("storeSetEvent", eventListener)
    }

    const cachedStoreValuesRef = useRef({})
    function getStoreSnapshot() {
        const newStoreValues = storeRef.current.getStoreValues()
        if (ObjectUtils.shallowEqual(cachedStoreValuesRef.current, newStoreValues)) {
            return cachedStoreValuesRef.current
        }
        // Create a new reference to ensure React detects changes
        cachedStoreValuesRef.current = { ...newStoreValues }
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
    // Memoizing the context value reduces the number of refreshes
    const storeContextValue = useMemo(
        () => ({
            state,
            setState : storeRef.current.set,
        }),
        [cachedStoreValuesRef.current]
    )

    return storeContextValue
}