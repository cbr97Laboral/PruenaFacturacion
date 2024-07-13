import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../../AppLayout";
import App from "../../pages/App";
import Login from "../../Componentes/Login/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout/>,
    children: [
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "App",
        element: <App/>
      },
    ],
  },
]);
