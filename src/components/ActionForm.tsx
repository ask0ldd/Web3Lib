function ActionForm(){

    function handleSubmit(formData : FormData){
        console.log(formData.get('lastname'))
    }

    return(
        <form className="flex flex-col gap-y-[0.5rem]" action={handleSubmit}>
            <label className="flex justify-start">LastName</label>
            <input className="flex h-[50px] justify-center items-center mb-[1rem]" type="text" name="lastname"/>
            <button className="flex h-[50px] justify-center items-center" type="submit">send</button>
        </form>
    )
}

export default ActionForm