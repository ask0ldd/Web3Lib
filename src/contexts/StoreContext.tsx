/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode } from "react";
import useStore from "../hooks/useStore";
import TestStore from "../store/TestStore";

interface StoreContextValue {
  storeValues: Record<string, any>
  store: TestStore
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeData = useStore()
  console.log("storeRefresh")

  return (
    <StoreContext.Provider value={storeData}>
      {children}
    </StoreContext.Provider>
  )
}