/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import ERC20TokenService from './services/ERC20TokenService';
import { THexAddress } from './types/THexAddress';
import { VITE_ACCOUNT2_ADDRESS } from './env/env';
import useWalletClient from './hooks/useWalletClient';

declare global {
  interface Window {
      /*ethereum: EIP1193Provider*/
      ethereum?: {
        request: (args: { method: string }) => Promise<string[]>;
        on: (event: string, callback: (accounts: string[]) => void) => void;
        removeListener: (event: string, callback: (accounts: string[]) => void) => void;
        selectedAddress : string
      };
  }
}

function App() {

  const {walletClient} = useWalletClient()

  async function handleOnClick(){
    try{
      if(!window.ethereum || !walletClient) return
      const erc20Service = new ERC20TokenService()
      erc20Service.setAllowance({
        walletClient,
        contractAddress : '0xf33c13a871b8132827d0370359024726d137d98f' as THexAddress,
        spenderAddress : VITE_ACCOUNT2_ADDRESS,
        amount : 20n,
      })
    }catch(error){
      console.error(error)
    }
  }

  return (
    <div style={{display:'flex', flexDirection:'column'}}>
      {JSON.stringify(walletClient?.getAddresses() ?? "wallet not available")}
      {/*JSON.stringify(accounts)*/}
      <button onClick={handleOnClick}>Click</button>
    </div>
  )
}

export default App

/*interface EIP1193Provider {
  request(args: { method: string; params?: Array<unknown> }): Promise<unknown>;
  on(eventName: string, listener: (...args: any[]) => void): void;
  removeListener(eventName: string, listener: (...args: any[]) => void): void;
}*/
