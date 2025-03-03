/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import ERC20TokenService from './services/ERC20TokenService';
import { THexAddress } from './types/THexAddress';
import { VITE_ACCOUNT2_ADDRESS } from './env/env';
import useWalletClient from './hooks/Wallet/useWalletClient';
import WindowEthereumService from './services/WindowEthereumService';
import { useStoreContext } from './hooks/Store/useStoreContext';
import { Suspense } from 'react';
import DelayedComponent from './components/DelayedComponent';
import { ErrorBoundary } from 'react-error-boundary';
import ComponentWithEasedTransition from './components/ComponentWithEasedTransition';
import Link from './router/Link';
import ActionForm from './components/ActionForm';

declare global {
    interface Window {
        /*ethereum: EIP1193Provider*/
        ethereum?: {
            request: (args: { method: string, params? : unknown[] }) => Promise<string[]>;
            on: (event: string, callback: (accounts: string[]) => void) => void;
            removeListener: (event: string, callback: (accounts: string[]) => void) => void;
            selectedAddress : string
        }
    }
}

function App() {

    const {walletClient, walletAddresses, disconnect, isConnected, walletActiveChain} = useWalletClient()

    const {state : storeState, setState : setStoreState, setSlice : setStoreSlice, store} = useStoreContext()

    async function handleConnectWallet() {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const address = await WindowEthereumService.requestAccount()
                    // if(isHexAddress(address)) LocalStorageService.storeWalletAddress(address)
                } catch (error) {
                    console.error('User denied account access : ', error);
                }
            } else {
                console.log('Please install MetaMask or another Ethereum-compatible wallet')
            }
    }
    
    async function handleDisconnectWallet(){
        // await requestPermission()
        disconnect()
    }

    async function handleSetAllowanceClick(){
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

    function addValue(){
        // setStoreState({test : "supertest" + Math.random()})
        setStoreState({test : "supertest" + Math.random()})
    }

    function logValue(){
        console.log(JSON.stringify(storeState))
    }

    return (
        <div className='flex flex-col shrink-0 w-[1000px] bg-slate-200 gap-y-[20px] p-[20px]'>
            <div className='flex flex-row gap-x-[10px] h-[45px]'>
                <span className='flex flex-row w-[50%] gap-x-[10px] h-full bg-slate-100 justify-center items-center rounded-sm'>Address : {walletAddresses[0] ?? 'wallet not available'}</span>
                <span className='flex flex-row w-[50%] gap-x-[10px] h-full bg-slate-100 justify-center items-center rounded-sm'>Connected : {isConnected ? "true" : "false"}</span>
            </div>
            <div>{walletActiveChain}</div>
            <button className='rounded-sm' onClick={handleSetAllowanceClick}>Set Allowance</button>
            <button className='rounded-sm' onClick={handleConnectWallet}>Connect Wallet</button>
            <button className='rounded-sm' onClick={handleDisconnectWallet}>Disconnect Wallet</button>
            <button className='rounded-sm' onClick={addValue}>Add Value</button>
            <button className='rounded-sm' onClick={logValue}>Log Value</button>
            {JSON.stringify(storeState.test)}
            <ErrorBoundary fallback={<div>Error!</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    <DelayedComponent/>
                    
                </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={<div>Error!</div>}>
                <Suspense fallback={<div>Loading...</div>}>
                    <ComponentWithEasedTransition/>
                </Suspense>
            </ErrorBoundary>
            <Link href={"/test1/"}>Page 1</Link>
            <Link href={"/test2/"}>Page 2</Link>
            <Link href={"/item/2"}>Item 2</Link>
            <Link href={"/item/22"}>Item 22</Link>
            <ActionForm/>
        </div>
    )
}

export default App

/*interface EIP1193Provider {
  request(args: { method: string; params?: Array<unknown> }): Promise<unknown>;
  on(eventName: string, listener: (...args: any[]) => void): void;
  removeListener(eventName: string, listener: (...args: any[]) => void): void;
}*/
