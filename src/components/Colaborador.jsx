import useProyectos from "../hook/useProyectos"

const Colaborador = ({colaborador}) => {

    const {handleModalEliminarColaborador, modalEliminarColaborador} = useProyectos()

    const {nombre,email} = colaborador

    return (
        <div className="flex justify-between items-center border-b p-5">

            <div>
                <p>{nombre}</p>
                <p className="text-sm text-gray-700">{email}</p>
            </div>

            <div>
                <button type="button" onClick={() => handleModalEliminarColaborador(colaborador)}
                        className="bg-red-600 text-white uppercase rounded-lg py-3 px-4 hover:bg-red-700 transition-colors shadow font-bold text-sm ">
                    Eliminar
                </button>
            </div>

        </div>
    )
}

export default Colaborador