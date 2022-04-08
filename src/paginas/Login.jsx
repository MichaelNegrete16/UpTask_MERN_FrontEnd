import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hook/useAuth"

const Login = () => {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [alerta,setAlerta] = useState('')

    const {setAuth} = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()

        if([email,password].includes('')){
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        try {
            
            const {data} = await clienteAxios.post('/usuarios/login',{email,password})
            localStorage.setItem('token', data.token)
            setAuth(data)
            navigate('/proyectos')

        } catch (error) {
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
                Inicia sesion y administra tus {''} <span className='text-slate-700'>proyectos</span> 
            </h1>

            {msg && <Alerta alerta={alerta}/>}

            <form className='my-10 shadow bg-white rounded-lg p-10' onSubmit={handleSubmit}>
                <div className="my-5">
                    <label htmlFor="email" className='uppercase text-gray-600 block text-xl font-bold'>Email</label>
                    <input type="email" placeholder="Ingresa Email" className="w-full mt-3 p-3 border rounded-xl bg-gray-200" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="my-5">
                    <label htmlFor="password" className='uppercase text-gray-600 block text-xl font-bold'>Password</label>
                    <input type="password" placeholder="Ingresa Email" className="w-full mt-3 p-3 border rounded-xl bg-gray-200" id="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                <input 
                    type="submit" 
                    value='Iniciar Sesion' 
                    className="w-full bg-sky-700 py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5" />

            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link to='registrar' className="block text-center my-5 text-slate-500 uppercase text-sm">¿No Tienes una cuenta? Registrate</Link>
                <Link to='/olvide-password' className="block text-center my-5 text-slate-500 uppercase text-sm">Olvide Mi Password</Link>
            </nav>

        </>
    )
}

export default Login