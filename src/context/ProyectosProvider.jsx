import {useState, useEffect, createContext} from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import useAuth from '../hook/useAuth'

let socekt

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) =>{

    const [proyectos,setProyectos] = useState([])
    const [alerta,setAlerta] = useState({})
    const [proyecto,setProyecto] = useState({})
    const [cargando,setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [colaborador, setColaborador]= useState({})
    const [buscador, setBuscandor]= useState(false)

    const navigate = useNavigate()
    const {auth} = useAuth()

    useEffect(()=>{
        const obtenerProyectos= async ()=>{
            try {
                
                const token = localStorage.getItem('token')
                if(!token) return

                const config ={
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const {data} = await clienteAxios('/proyectos',config)
                setProyectos(data)
            } catch (error) {
                console.log(error)
            }
        }

        obtenerProyectos()

    },[auth])

    //Abrir conexion a socekt Io 
    useEffect(()=>{
        socekt = io(import.meta.env.VITE_BACKEND_URL)
    },[])

    const mostrarAlerta = alerta =>{
        setAlerta(alerta)
        setTimeout(()=>{
            setAlerta({})
        },3000)
    }

    const submitProyecto = async proyecto =>{

        if(proyecto.id){
           await editarProyecto(proyecto)
        }else{
           await nuevoProyecto(proyecto)
        }

    }


    const editarProyecto = async proyecto =>{
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`,proyecto,config)
            //Sincronizar el state
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)
            //Mostrar la alerta
            setAlerta({
                msg:'Proyecto Actualizado Correctamente',
                error:false
            })
            //Redireccionar
            setTimeout(()=>{
                setAlerta({})
                navigate('/proyectos')
            },2000)


        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto =>{
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos',proyecto,config)
            //Copiar los datos a proyectos para evitar recargar la base de datos y que los datos se muestren
            setProyectos({...proyectos, data})

            setAlerta({
                msg:'Proyecto Creado Correctamente',
                error:false
            })

            setTimeout(()=>{
                setAlerta({})
                navigate('/proyectos')
            },2000)

        } catch (error) {
            console.log(error)
        }
    }


    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios(`/proyectos/${id}`,config)
            setProyecto(data)
            setAlerta({})

        } catch (error) {

            navigate('/proyectos')
            
            setAlerta({
                msg: error.response.data.msg,
                error:true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2000);
            
        } finally{
            setCargando(false)
        }
    }

    const eliminarProyecto = async id =>{
        try {
            
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.delete(`/proyectos/${id}`,config)
            
            //Sincronizar el satate
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)

            setAlerta({
                msg:data.msg,
                error:false
            })

            setTimeout(()=>{
                setAlerta({})
                navigate('/proyectos')
            },2000)

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea =>{


        if(tarea?.id){
           await editarTarea(tarea)
        }else{
           await crearTarea(tarea)
        }

    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`,tarea,config)
            console.log(data)
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)
            setProyecto(proyectoActualizado)
            

            setAlerta({})
            setModalFormularioTarea(false)

            //Socket 
            socekt.emit('actualizarTarea', data)

        } catch (error) {
            console.log(error)
        }
    }

    const crearTarea = async tarea =>{
        try {

            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/tareas',tarea,config)
            console.log(data)

            setAlerta({})
            setModalFormularioTarea(false)

            // Socekt Io
            socekt.emit('nuevaTarea',data)

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalEditarTarea = tareas =>{
        setTarea(tareas)
        setModalFormularioTarea(true)
    }

    const handleModalELiminarTarea = tarea =>{
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const handleModalEliminarColaborador = colaborador =>{
        setColaborador(colaborador)
        setModalEliminarColaborador(!modalEliminarColaborador)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`,config)
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyecto.tareas.filter(tareaState => tareaState._id !== tarea._id)
            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error:false
            })
            setModalEliminarTarea(false)

            //Socket io
            // socekt.emit('eliminarTarea',tarea)

            setTimeout(() => {
                setAlerta({})
            }, 3000);
            setTarea({})

        } catch (error) {
            console.log(error)
        }
    }

    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos/colaboradores',{email},config)
            setColaborador(data)
            setAlerta({})

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }finally{
            setCargando(false)
        }
    }

    const agregarColaborador = async email =>{
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`,email,config)
            setAlerta({
                msg:data.msg,
                error:false
            })

            setColaborador({})

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            },2000);


        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error:true
            })
        }
    }

    const eliminarColaborador = async () => {
        console.log(colaborador._id)
        try {

            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`,{id: colaborador._id}, config)

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)

            setAlerta({
                msg:data.msg,
                error:false
            })

            setTimeout(() => {
                setAlerta({})
            },2000);

            setColaborador({})
            setModalEliminarColaborador(false)
        } catch (error) {
            // console.log(error.response)
            setAlerta({
                msg: error.response.data.msg,
                error:true
            })
        }
    }

    const completarTarea = async id =>{
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/tareas/estado/${id}`,{},config)
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)
            setProyecto(proyectoActualizado)
            setTarea({})
            setAlerta({})

        } catch (error) {
            console.log(error.response)
        }
    }

    const handleBuscador = () =>{
        setBuscandor(!buscador)
    }

    // Socket io
    const submitTareasProyecto = (tarea) => {
        //Agrega la tarea al state al room de socket
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea ]
        setProyecto(proyectoActualizado)
    }

    // const eliminarTareaProyecto = tarea =>{
    //     const proyectoActualizado = {...proyecto}
    //     proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
    //     setProyecto(proyectoActualizado)
    // }


    // const actualizarTareaProyecto = tarea =>{
    //     const proyectoActualizado = {...proyecto}
    //     proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? tarea : tareaState)
    //     setProyecto(proyectoActualizado)
    // }

    const cerrarSesionProyectos = () =>{
        setProyecto({})
        setProyectos([])
        setAlerta({})
    }

    return(

        <ProyectosContext.Provider value={{handleModalEditarTarea,tarea,eliminarColaborador,cerrarSesionProyectos,
                                           completarTarea,buscador,handleBuscador,submitTareasProyecto,
                                           handleModalEliminarColaborador,modalEliminarColaborador,
                                           submitColaborador,colaborador,
                                           agregarColaborador,
                                           handleModalELiminarTarea,
                                           modalEliminarTarea,eliminarTarea,
                                           proyectos,mostrarAlerta,
                                           alerta,submitProyecto,
                                           obtenerProyecto,proyecto,
                                           cargando,eliminarProyecto,
                                           modalFormularioTarea,
                                           handleModalTarea,submitTarea}}>
            {children}
        </ProyectosContext.Provider>

    )
}

export {
    ProyectosProvider
}

export default ProyectosContext