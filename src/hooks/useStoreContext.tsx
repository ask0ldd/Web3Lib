/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext } from "react";
import { StoreContext } from "../contexts/StoreContext";

export function useStoreContext(){
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStoreContext must be used within a StoreProvider')
  }
  return context
}