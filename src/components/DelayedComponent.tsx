/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { use, useEffect, useReducer, useState, useTransition } from "react";

const dataPromise = new Promise<string>((resolve, reject) => {
    setTimeout(() => reject("coucou"), 4000)
    // setTimeout(() => resolve("coucou"), 4000)
})
  
export default function DelayedComponent() {
    const [index, setIndex] = useState(0)
    
    const data = use(dataPromise)

    return (
        <div className={"flex p-[20px] bg-green-100"}>
            {data}
        </div>
    )
}