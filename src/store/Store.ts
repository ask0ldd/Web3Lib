/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Store{
    store: Record<string, any>

    constructor(){
        this.store = {}
    }
    
    setSlice(obj: { [key: string]: unknown }) {
        this.store = {...this.store, ...obj}
        window.dispatchEvent(new CustomEvent("storeSetEvent"))
    }

    set(key : string, value : unknown){
        this.store.set(key, value)
    }

    getValue(key : string){
        if(!this.store[key]) return null
        return this.store[key]
    }

    getStoreValues(){
        return {...this.store}
    }
}