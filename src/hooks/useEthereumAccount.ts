import { useSyncExternalStore } from "react";

export default function useEthereumAccount(){
    function subscribe(callback: (accounts: string[]) => void){
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', callback)
            window.ethereum.on('_initialized', callback)
            window.ethereum.on('connect', callback)
            window.ethereum.on('disconnect', callback)
            window.ethereum.on('terminate', callback)
            // window.ethereum.on('chainChanged', callback)
            return () => {
                window.ethereum?.removeListener('accountsChanged', callback)
                window.ethereum?.removeListener('_initialized', callback)
                window.ethereum?.removeListener('connect', callback)
                window.ethereum?.removeListener('disconnect', callback)
                window.ethereum?.removeListener('terminate', callback)
            }
        }
        return () => {};
    }

    let cachedAddress: string | null = null
    function getSnapshot() {
        if (!window.ethereum) return null
        const newAddress = window.ethereum.selectedAddress
        if (cachedAddress == newAddress) return cachedAddress
        cachedAddress = newAddress
        return newAddress
    }

    const address = useSyncExternalStore(
        subscribe, 
        getSnapshot
    )

    return { address }
}