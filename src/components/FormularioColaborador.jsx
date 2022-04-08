import { useState } from "react"
import useProyectos from "../hook/useProyectos"
import Alerta from "./Alerta"

const FormularioColaborador = () => {

    const [email,setEmail] = useState('')
    const {mostrarAlerta,alerta,submitColaborador} = useProyectos()

    const handleSubmit = e => {
        e.preventDefault()

        if(email === ''){
            mostrarAlerta({
                msg:'El Email es Obligatorio',
                error:true
            })
            return
        }

        submitColaborador(email)
    }

    const {msg} = alerta

    return (
        <form className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow" onSubmit={handleSubmit}>
            {msg && <Alerta alerta={alerta}/>}
            <div className='mb-5'>
                <label htmlFor="email" className='text-gray-700 font-bold text-sm uppercase'> Email Colaborador</label>
                <input type="email" id='email' className='w-full p-2 mt-2 border-2 placeholder-gray-700' placeholder='Email del usuario' value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <input type='submit' 
                    value='Buscar Colaborador'
                    className='text-sm bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded' />

        </form> 
  )
}

export default FormularioColaborador