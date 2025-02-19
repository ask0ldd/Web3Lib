/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { use, useEffect, useReducer, useState, useTransition } from "react";

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
  
export default function ComponentWithTransition() {
    const [index, setIndex] = useState(0)
    const [state, setState] = useReducer((state, action) => ({...state}), {})
    const [isPending, startTransition] = useTransition()
    
    const data = use(promisesList[index])

    function handleNext(){
        startTransition(() => setIndex(index => index+1))
    }

    return (
        <div className={"flex p-[20px] bg-green-100" + (isPending ? " opacity-30" : " opacity-100")}>
            {data}
            <button onClick={handleNext}></button>
        </div>
    )
}