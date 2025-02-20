import { useRouter } from "../router/useRouter"

export default function Item(){

    const {getParams} = useRouter()
    return(
        <div>Item {getParams()[0]}</div>
    )
}