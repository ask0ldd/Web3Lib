import { use } from "react";

const dataPromise = new Promise<string>((resolve, reject) => {
    setTimeout(() => reject("coucou"), 4000)
    // setTimeout(() => resolve("coucou"), 4000)
})
  
export default function DelayedComponent() {
    const data = use(dataPromise)
    return (<div>{data}</div>)
}