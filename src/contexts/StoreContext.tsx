/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode } from "react";
import useStore2 from "../hooks/Store/useStore2";
import Store from "../store/Store";

interface StoreContextValue {
    state: Record<string, unknown>
    setState: (state : Record<string, unknown>) => void
    setSlice: (obj: {[key: string]: unknown}) => void
    store: Store
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
    const storeContextValue = useStore2()
    console.log("storeRefresh")

    return (
        <StoreContext value={storeContextValue}>
            {children}
        </StoreContext>
    )
}