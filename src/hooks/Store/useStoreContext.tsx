/* eslint-disable @typescript-eslint/no-explicit-any */

import { use } from "react";
import { StoreContext } from "../../contexts/StoreContext";

export function useStoreContext(){
  const context = use(StoreContext);
  if (context === undefined) {
    throw new Error('useStoreContext must be used within a StoreProvider')
  }
  return context
}