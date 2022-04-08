import { formatearFecha } from "../helpers/formatearFecha"
import useProyectos from "../hook/useProyectos"
import useAdmin from "../hook/useAdmin"

const Tarea = ({tarea}) => {

    const {handleModalEditarTarea,handleModalELiminarTarea,completarTarea} = useProyectos()

    const {descripcion,nombre,prioridad,fechaEntrega, _id,estado} = tarea

    const admin = useAdmin()

    return (
        <div className='border-b p-5 flex justify-between items-center '>

            <div className="flex flex-col items-start">
                <p className="text-xl mb-1">{nombre}</p>
                <p className="text-sm text-gray-500 uppercase mb-1">{descripcion}</p>
                <p className="text-xl mb-1">{formatearFecha(fechaEntrega)}</p>
                <p className="text-gray-600 mb-1">Prioridad: {prioridad}</p>
                {estado && <p className="text-xs bg-green-600 uppercase rounded-lg p-1 text-white">Completad@ Por: {tarea.completado.nombre} </p>}
            </div>

            <div className='flex gap-2 flex-col lg:flex-row'>

                {admin && (
                    <button className='bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg hover:bg-indigo-700 transition-colors' onClick={() => handleModalEditarTarea(tarea)}>Editar</button>
                )}


                <button className={`${estado ? 'bg-sky-600 hover:bg-sky-700 transition-colors' : 'bg-gray-600 hover:bg-gray-700 transition-colors'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg `}onClick={()=> completarTarea(_id)}> {estado ? 'Completa' : 'Incompleta'} </button>


                {admin &&(
                    <button className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg hover:bg-red-700 transition-colors' onClick={() => handleModalELiminarTarea(tarea)} >Eliminar</button>
                )}

            </div>

        </div>
    )
}

export default Tarea