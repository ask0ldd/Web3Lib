/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Store extends EventTarget{
    store: Record<string, any>

    constructor(){
        super()
        this.store = {}
    }
    
    setSlice(obj: { [key: string]: unknown }) {
        this.store = {...this.store, ...obj}
        this.dispatchEvent(new CustomEvent("storeSetEvent"))
    }

    /*set(key : string, value : unknown){
        this.store.set(key, value)
    }*/

    setState(state : Record<string, any>){
        this.store = {...state}
        this.dispatchEvent(new CustomEvent("storeSetEvent"))
    }

    getSlice(key : string){
        if(!this.store[key]) return null
        return this.store[key]
    }

    getState(){
        return this.store
    }
}