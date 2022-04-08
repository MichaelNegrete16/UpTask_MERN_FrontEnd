import { useState } from "react"
import { Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const OlvidePassword = () => {

    const [email,setEmail] = useState('')
    const [alerta,setAlerta] = useState({})

    const handleSubmit = async (e) =>{
        e.preventDefault()


        if(email === '' || email.length < 6){
            setAlerta({
                msg: 'El Email es obligatorio',
                error: true
            })
            return
        }

        setAlerta({})

        //Mandar el put del email
        try{
            const {data} = await clienteAxios.post(`/usuarios/olvide-password`,{email})
            setAlerta({
                msg:data.msg,
                error:false
            })
            setEmail('')
        }catch(error){
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

    }

    const {msg} = alerta


    return (
        <>
        <h1 className='font-black text-sky-600 text-6xl capitalize'>
            Recupera tu acceso y no pierdas tus {''} <span className='text-slate-700'>proyectos</span> 
        </h1>

        {msg && <Alerta alerta={alerta}/>}

        <form className='my-10 shadow bg-white rounded-lg p-10' onSubmit={handleSubmit} >

            
            <div className="my-5">
                <label htmlFor="email" className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
                <input type="email" placeholder="Ingresa Email" className="w-full mt-3 p-3 border rounded-xl bg-gray-200" id="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <input 
                type="submit" 
                value='Enviar Instrucciones' 
                className="w-full bg-sky-700 py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5" />

        </form>

        <nav className='lg:flex lg:justify-between'>
            <Link to='/' className="block text-center my-5 text-slate-500 uppercase text-sm">¿Ya Tienes una cuenta? Inicia Sesion</Link>
            <Link to='/registrar' className="block text-center my-5 text-slate-500 uppercase text-sm">¿No Tienes una cuenta? Registrate</Link>
        </nav>

    </>
    )
}

export default OlvidePassword