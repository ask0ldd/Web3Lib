/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useSyncExternalStore } from "react";
import TestStore from "../store/TestStore";
import ObjectUtils from "../utils/ObjectUtils";

export default function useStore(){

    const storeRef = useRef<TestStore>(new TestStore())

    function subscribe(callback : () => void){
        if (!window) return () => {}
        const eventListener = () => callback()
        window.addEventListener("storeSetEvent", eventListener)
        return () => window.removeEventListener("storeSetEvent", eventListener)
    }

    const cachedStoreValuesRef = useRef({})
    function getSnapshot() {
        const newStoreValues = storeRef.current.getStoreValues()
        if (ObjectUtils.shallowEqual(cachedStoreValuesRef.current, newStoreValues)) {
            return cachedStoreValuesRef.current
        }
        // Create a new reference to ensure React detects changes
        cachedStoreValuesRef.current = { ...newStoreValues }
        console.log(JSON.stringify(newStoreValues))
        return cachedStoreValuesRef.current
    }

    const storeValues = useSyncExternalStore(
        subscribe, 
        getSnapshot
    )

    // Return updated storeData to the provider only when the cachedStoreValuesRef has changed
    // meaning : the snapshot contained new values
    const storeData = useMemo(
        () => ({
          storeValues,
          store: storeRef.current,
        }),
        [cachedStoreValuesRef.current]
    )

    return storeData
}