import { useEffect, useState } from "react";
import useEthereumAccount from "./useEthereumAccount";
import { createWalletClient, custom, WalletClient } from "viem"
import { holesky } from "viem/chains";
import { THexAddress } from "../../types/THexAddress";
import WindowEthereumService from "../../services/WindowEthereumService";

interface IWallet{
    client : WalletClient | null
    addresses : THexAddress[]
    isConnected : boolean
    chain : string | null
}

const defaultWallet : IWallet = {
    client : null,
    addresses : [],
    isConnected : false,
    chain : null
}

export default function useWalletClient(){

    const {address} = useEthereumAccount()
    const [wallet, setWallet] = useState<IWallet>({...defaultWallet})

    async function requestPermission(){
        try {
            if(!window.ethereum) throw new Error("Can't access any wallet extension.")
            await WindowEthereumService.requestPermissions()
            console.log("Wallet disconnected successfully");
        } catch (error) {
            console.error("Failed to disconnect wallet:", error);
        }
    }

    function disconnect(){
        setWallet({...defaultWallet})
    }

    useEffect(() => {
        async function refreshWalletClient(){
            if(!window.ethereum) return setWallet({...defaultWallet})
            const account = await WindowEthereumService.requestAccount()
            const client = createWalletClient({
                account : account as THexAddress,
                chain : holesky,
                transport: custom(window.ethereum)
            })
            setWallet({
                client,
                addresses : await client.getAddresses(),
                isConnected : true,
                chain : client.chain.name
            })
        }
        refreshWalletClient()
    }, [address])

    return {walletClient : wallet.client, walletAddresses : wallet.addresses, walletActiveChain : wallet.chain, requestPermission, disconnect, isConnected : wallet.isConnected}
}