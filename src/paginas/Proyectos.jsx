import useProyectos from "../hook/useProyectos"
import PreviewProyecto from "../components/PreviewProyecto"
import Alerta from "../components/Alerta"
import { useEffect } from "react"

const Proyectos = () => {

    const {proyectos,alerta} = useProyectos()


    const {msg} = alerta

    return (
        <>
            <h1 className='text-4xl font-bold'>Proyectos</h1>

            {msg && <Alerta alerta={alerta}/>}

            <div className='bg-white shadow mt-5 rounded-lg '>
                {proyectos.length ? 
                    proyectos.map(proyecto => (
                        <PreviewProyecto key={proyecto._id} proyecto={proyecto} />
                    ))
                : <p className='text-center uppercase text-gray-600 p-5'>No hay aun</p>}
            </div>
        </>
  )
}

export default Proyectos