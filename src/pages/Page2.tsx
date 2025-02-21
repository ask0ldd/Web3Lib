import Link from "../router/Link";
import { useRouter } from "../router/useRouter";

export default function Page2(){
    const { navigate } = useRouter()
    return(
        <div>
            This is Page 2!
            <Link href={"/"}>Home</Link>
            <div onClick={() => navigate('/')}>Nav Test</div>
        </div>
    )
}