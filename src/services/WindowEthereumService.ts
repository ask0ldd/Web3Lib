export default class WindowEthereumService{

    static async walletRequestPermissions(){
        if(!window.ethereum) return false
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }]
        })
    }

    static async requestAccount() : Promise<string> {
        return (await window.ethereum!.request({ method: 'eth_requestAccounts' }))[0]
    }
}