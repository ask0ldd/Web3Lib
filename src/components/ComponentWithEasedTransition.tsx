/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { use, useEffect, useReducer, useRef, useState, useTransition } from "react";

/*const dataPromise = new Promise<string>((resolve, reject) => {
    setTimeout(() => reject("coucou"), 4000)
    // setTimeout(() => resolve("coucou"), 4000)
})*/

/*const valuesList = ["4000", "8000" , "16000", "32000"]
function sequentialFn(){
    return new Promise<string>((resolve) => {
        setTimeout(() => resolve(valuesList[index]), 2000)
    })
}*/
const promisesList = [
    new Promise<string>((resolve, reject) => {
        setTimeout(() => resolve("coucou"), 4000)}),
    new Promise<string>((resolve, reject) => {
        setTimeout(() => resolve("salut"), 8000)}),
    new Promise<string>((resolve, reject) => {
        setTimeout(() => resolve("hello"), 12000)}),
    new Promise<string>((resolve, reject) => {
        setTimeout(() => resolve("hi"), 16000)}),
]

function useEaseDelay(isPending : boolean, {minInitialDelay, minDuration} : {minInitialDelay : number, minDuration : number}){
    const [newPending, setNewPending] = useState<boolean>(false)
    const minDurationExaustedRef = useRef(false)
    console.log(newPending)

    const executed = useRef(false)
    // delays the transition
    useEffect(() => {
        if(executed.current) return
        executed.current = true
        console.log("start")
        // wait for the initial delay
        const initialDelayTimeout = setTimeout(() => {
            if(isPending) {
                setNewPending(true)
                // enforce min duration
                const durationTimeout = setTimeout(() => {
                    if(!isPending) {
                        setNewPending(false)
                    } else {
                        // if min duration exausted but still isPending
                        minDurationExaustedRef.current = true
                    }
                }, minDuration)

                return () => clearTimeout(durationTimeout);
            }
        }, minInitialDelay)

        return () => clearTimeout(initialDelayTimeout);
    }, [])

    // if min duration exausted, the state of ispending becomes the state of newpending
    useEffect(() => {
        console.log("end")
        if(isPending && minDurationExaustedRef.current) setNewPending(false)
    }, [isPending, minDurationExaustedRef.current])

    return newPending
}
  
export default function ComponentWithEasedTransition() {
    const [index, setIndex] = useState(0)
    // const [state, setState] = useReducer((state, action) => ({...state}), {})
    const [isPending, startTransition] = useTransition()

    // const newPending = useEaseDelay(isPending, {minInitialDelay : 2000, minDuration : 5000})
    const [newPending, setNewPending] = useState<boolean>(false)
    const minDurationExaustedRef = useRef(false)
    useEffect(() => {
        console.log("test")
        if(isPending == false) return
        const delayTimeout = setTimeout(() => {
            // start transition if still pending after initial delay
            if(isPending == true) {
                setNewPending(true)
                const durationTimeout = setTimeout(() => {
                    setNewPending(false)
                }, 5000)
                return () => clearTimeout(durationTimeout)
            }
        }, 2000)
        return () => clearTimeout(delayTimeout)
    }, [isPending])
    
    const data = use(promisesList[index])

    function handleNext(){
        startTransition(() => setIndex(index => index+1))
    }

    return (
        <div className={"flex p-[20px] bg-green-100" + (newPending ? " opacity-30" : " opacity-100")}>
            {data}
            <button onClick={handleNext}></button>
        </div>
    )
}