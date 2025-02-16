/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode } from "react";
import useStore from "../hooks/useStore";
import Store from "../store/Store";

interface StoreContextValue {
  state: Record<string, unknown>
  store: Store
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeContextValue = useStore()
  console.log("storeRefresh")

  return (
    <StoreContext.Provider value={storeContextValue}>
      {children}
    </StoreContext.Provider>
  )
}