import { Link } from "react-router-dom"
import useAuth from "../hook/useAuth"

const PreviewProyecto = ({proyecto}) => {

    const {auth} = useAuth()
    const {nombre,_id,cliente,creador} = proyecto

    return (
        <div className='border-b p-5 flex justify-between flex-col md:flex-row'>
            
            <div className="flex items-center gap-2">
                
                <p className='flex-1'> 
                    {nombre} 
                    <span className='text-sm uppercase text-gray-500'>{''} {cliente}</span>
                </p>

                {auth._id !== creador &&(
                    <p className="p-1 text-xs rounded-lg text-white bg-green-500 font-bold uppercase">Colaborador</p>
                )}

            </div>

            

            <Link to={`${_id}`} className='text-gray-600 font-bold uppercase hover:text-gray-700 text-sm'>Ver Proyecto</Link>
        </div>
    )
}

export default PreviewProyecto