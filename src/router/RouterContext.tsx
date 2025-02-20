import { createContext } from "react"

export const RouterContext = createContext<RouterContextValue | undefined>(undefined)

interface RouterContextValue {
    getParams : () => string[]
    navigate : (path : string) => void
}