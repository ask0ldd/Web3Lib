/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import ERC20TokenService from './services/ERC20TokenService';
import { THexAddress } from './types/THexAddress';
import { VITE_ACCOUNT2_ADDRESS } from './env/env';
import useWalletClient from './hooks/useWalletClient';
import WindowEthereumService from './services/WindowEthereumService';
import { useStoreContext } from './hooks/useStoreContext';

declare global {
  interface Window {
      /*ethereum: EIP1193Provider*/
      ethereum?: {
        request: (args: { method: string, params? : unknown[] }) => Promise<string[]>;
        on: (event: string, callback: (accounts: string[]) => void) => void;
        removeListener: (event: string, callback: (accounts: string[]) => void) => void;
        selectedAddress : string
      };
  }
}

function App() {

  const {walletClient, walletAddresses, requestPermission} = useWalletClient()

  const {state : storeState, store} = useStoreContext()

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await WindowEthereumService.requestAccount()
        console.log('Wallet connected successfully');
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      console.log('Please install MetaMask or another Ethereum-compatible wallet');
    }
  }

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

  async function disconnectWallet(){
    await requestPermission()
  }

  function addValue(){
    store.setSlice({test : "supertest" + Math.random()})
  }

  function logValue(){
    console.log(JSON.stringify(storeState))
  }

  return (
    <div style={{display:'flex', flexDirection:'column'}}>
      {JSON.stringify(walletAddresses[0] ?? "wallet not available")}
      <button onClick={handleOnClick}>Set Allowance</button>
      <button onClick={connectWallet}>Connect Wallet</button>
      <button onClick={disconnectWallet}>Disconnect Wallet</button>
      <button onClick={addValue}>Add Value</button>
      <button onClick={logValue}>Log Value</button>
      {JSON.stringify(storeState.test)}
    </div>
  )
}

export default App

/*interface EIP1193Provider {
  request(args: { method: string; params?: Array<unknown> }): Promise<unknown>;
  on(eventName: string, listener: (...args: any[]) => void): void;
  removeListener(eventName: string, listener: (...args: any[]) => void): void;
}*/
