import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import useProyectos from "../hook/useProyectos"
import ModalFormularioTarea from "../components/ModalFormularioTarea"
import ModalEliminarTarea from "../components/ModalEliminarTarea"
import ModalEliminarColaborador from "../components/ModalEliminarColaborador"
import Tarea from "../components/Tarea"
import Colaborador from "../components/Colaborador"
import useAdmin from "../hook/useAdmin"
import io from 'socket.io-client'

let socket

const Proyecto = () => {


  const params = useParams()
  const {obtenerProyecto,proyecto,cargando,handleModalTarea,alerta,submitTareasProyecto,eliminarTareaProyecto,actualizarTareaProyecto} = useProyectos()
  const admin = useAdmin()


  useEffect(()=>{
    obtenerProyecto(params.id)
  },[])

  useEffect(()=>{
    socket = io(import.meta.env.VITE_BACKEND_URL)
    socket.emit('abrir proyecto', params.id)
  },[])

  useEffect(()=>{

    socket.on('tareaAgregada',tareaNueva =>{
      if(tareaNueva.proyecto === proyecto._id){
        submitTareasProyecto(tareaNueva)
      }
    })

    // socket.on('tareaElimanda', tareaEliminada=>{
    //   if(tareaEliminada.proyecto === proyecto._id){
    //     eliminarTareaProyecto(tareaEliminada)
    //   }
    // })

    // socket.on('tareaActualizada', tareaActualziada =>{
    //   if(tareaEliminada.proyecto === proyecto._id){
    //     actualizarTareaProyecto(tareaActualziada)
    //   }
    // })

  })

  const {nombre} = proyecto

  if(cargando) return 'Cargando..'

  const {msg } = alerta

  return (

 

      <>
        <div className='flex justify-between'>
          <h1 className='font-bold text-4xl'> {nombre} </h1>

        {admin && (
                    <div className='flex items-center gap-2 text-gray-400 hover:text-black'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
        
                    <Link to={`/proyectos/editar/${params.id}`} className='uppercase font-bold' >Editar</Link>
        
                  </div>
        )}

        </div>

        {admin && (
          <button type="button" onClick={handleModalTarea}
                  className='text-sm w-full px-5 py-3 md:w-auto rounded-lg font-bold uppercase bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center' >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Nueva Tarea
          </button>
        )}
        

        <p className='font-bold text-xl mt-10'>Tareas del proyecto</p>


        <div className='bg-white shadow mt-10 rounded-lg'>
            {proyecto.tareas?.length ? 
              proyecto.tareas?.map(tarea =>(
                <Tarea key={tarea._id} tarea={tarea} /> 
              )) : 
              <p className='p-10 text-center my-5'>No hay tareas en este proyecto</p>}
        </div>

        {admin && (
          <> 
             <div className='flex justify-between items-center mt-10 '>

                <p className='font-bold text-xl '>Colaboradores</p>
                
                <div className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <Link to={`/proyectos/nuevo-colaborador/${proyecto._id}`}  className='uppercase font-bold' >Añadir</Link>
                </div>    

            </div>

            <div className='bg-white shadow mt-10 rounded-lg'>
                {proyecto.colaboradores?.length ? 
                  proyecto.colaboradores?.map(colaborador =>(
                    <Colaborador colaborador={colaborador} key={colaborador._id}/>
                  )) : 
                  <p className='p-10 text-center my-5'>No hay colaboradores en este proyecto</p>}
            </div>
          </>
        )}
        
        
        

        <ModalFormularioTarea  />
        <ModalEliminarTarea />
        <ModalEliminarColaborador/>
      
    </>

    

    

    
    
  )
}

export default Proyecto