import { RouterProvider } from "react-router-dom";
import {router} from './PrivateRouters'
import Spinner from "../../Componentes/LoadPages/Spinner";

const AppRouter = () => {
    return (
        <RouterProvider router= {router} fallbackElement= {<Spinner/>}/>
    )
}

export default AppRouter