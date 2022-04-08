import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"



const NuevoPassword = () => {

    const [tokenValido,setTokenValido] = useState(false)
    const [passwordModificado,setPasswordModificado] = useState(false)
    const [password,setPassword] = useState('')
    const [alerta,setAlerta] = useState({})
    const params = useParams()
    const {token} = params

    useEffect(()=>{
        const comprobarToken = async () =>{
            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`)
                setTokenValido(true)
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
            }
        }
        comprobarToken()
    },[])

    const handleSubmit = async e =>{
        e.preventDefault()

        if(password < 6 ){
            setAlerta({
                msg: 'El Password debe tener minimo 6 caracteres',
                error:true
            })
            return
        }
        setPasswordModificado(true)

        try {
            const url = `/usuarios/olvide-password/${token}`
            const {data} = await clienteAxios.post(url,{password})
            setAlerta({
                msg: data.msg,
                error: false
            })
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

    }

    const {msg} =alerta

    

    return (
        <>
        <h1 className='font-black text-sky-600 text-6xl capitalize'>
            Restablece tu password y no pierdas acceso a tus {''} <span className='text-slate-700'>proyectos</span> 
        </h1>

        {msg && <Alerta alerta={alerta}/>}

        {tokenValido && (
                    <form className='my-10 shadow bg-white rounded-lg p-10' onSubmit={handleSubmit}>

                    <div className="my-5">
                        <label htmlFor="password" className='uppercase text-gray-600 block text-xl font-bold'>Nuevo password</label>
                        <input type="password" 
                               placeholder="Escribe tu nuevo Password" 
                               className="w-full mt-3 p-3 border rounded-xl bg-gray-200" id="password"
                               value={password}
                               onChange={e => setPassword(e.target.value)}/>
                    </div>
        
        
                    <input 
                        type="submit" 
                        value='Guardar Cambios' 
                        className="w-full bg-sky-700 py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
                         />
        
                </form>
        )}

        {passwordModificado && (
            <Link to='/' className="block text-center my-5 text-slate-500 uppercase text-sm">Inicia Sesion</Link>
        )}
            
            


    </>
  )
}

export default NuevoPassword