import { createPortal } from "react-dom";

export default function Snackbar(){
    return createPortal(
        <div>
            snackbar
        </div>, 
        document.body
    )
}