import { useEffect, useState } from "react";
import useEthereumAccount from "./useEthereumAccount";
import { createWalletClient, custom, WalletClient } from "viem"
import { holesky } from "viem/chains";
import { THexAddress } from "../types/THexAddress";
import WindowEthereumService from "../services/WindowEthereumService";

export default function useWalletClient(){
    const {address} = useEthereumAccount()

    const [walletClient, setWalletClient] = useState<WalletClient | null>(null)
    const [walletAddresses, setWalletAddresses] = useState<THexAddress[]>([])

    async function requestPermission(){
        if(!window.ethereum) return
        try {
            await WindowEthereumService.walletRequestPermissions()
            console.log("Wallet disconnected successfully");
        } catch (error) {
            console.error("Failed to disconnect wallet:", error);
        }
    }

    useEffect(() => {
        async function refreshWalletClient(){
            if(!window.ethereum) return setWalletClient(null)
            const account = await WindowEthereumService.requestAccount()
            const client = createWalletClient({
            account : account as THexAddress,
            chain: holesky,
            transport: custom(window.ethereum)
            })
            setWalletClient(client)
            const addr = await client.getAddresses()
            setWalletAddresses(addr)
        }
        refreshWalletClient()
    }, [address])

    return {walletClient, walletAddresses, requestPermission}
}