/* eslint-disable @typescript-eslint/no-explicit-any */
export default class TestStore{
    store: Record<string, any>

    constructor(){
        this.store = {}
    }
    
    setValue(obj : object){
        this.store = {...this.store, ...obj}
        window.dispatchEvent(new CustomEvent("storeSetEvent"))
    }

    getValue(propertyName : string){
        if(!this.store[propertyName]) return null
        return this.store[propertyName]
    }

    getStoreValues(){
        return {...this.store}
    }
}