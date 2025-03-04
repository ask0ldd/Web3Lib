/* eslint-disable @typescript-eslint/no-explicit-any */
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

interface FormState {
    lastname: string;
  }
  
interface ActionResult {
    lastname: string;
}

async function submitAction(_ : any, formData : FormData) : Promise<ActionResult> {
    const lastname = formData.get('lastname') as string;
    console.log(`Submitting lastname: ${lastname}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { lastname };
};
  
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending}>
        {pending ? 'Submitting...' : 'Submit'}
        </button>
    );
}

function ActionForm(){
    const [state, actionFn] = useActionState<FormState, (_ : any, formData : FormData) => Promise<ActionResult>>(submitAction, { lastname: '' });

    /*const handleSubmit = () => {
    startTransition(async () => {
        const error = await updateName(name);
        if (error) {
        setError(error);
        return;
        }
        console.log(formData.get('lastname'))
        redirect('/path');
    });
    };

    function handleSubmit(formData : FormData){
        console.log(formData.get('lastname'))
    }*/

    return(
        <form className="flex flex-col gap-y-[0.5rem]" action={actionFn}>
            <label className="flex justify-start">LastName</label>
            <input className="flex h-[50px] justify-center items-center mb-[1rem]" type="text" name="lastname" required/>
            {/*<button className="flex h-[50px] justify-center items-center" type="submit">send</button>*/}
            <SubmitButton />
            {state.lastname && <p>Hello, {state.lastname as string}!</p>}
        </form>
    )
}

export default ActionForm