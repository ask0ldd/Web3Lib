export default class WindowEthereumService{

    static async requestPermissions(){
        if(!window.ethereum) return false
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }]
        })
    }

    static async requestAccount() : Promise<string | undefined> {
        try {
            if(!window.ethereum) throw new Error("Can't access any wallet extension.")
            return (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0]
        } catch (error) {
            console.error(error);
        }
    }

    static async getChainId() : Promise<string | undefined> {
        try {
            if(!window.ethereum) throw new Error("Can't access any wallet extension.")
            const chainId = (await window.ethereum.request({ method: 'eth_chainId' }))[0]
            return chainId
        } catch (error) {
            console.error("Error getting chain ID:", error)
        }
    }
}