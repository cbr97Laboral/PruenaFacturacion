import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppLayout= () =>{
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          navigate("/App");
        }else{
            navigate("/login");
        }
      }, [navigate]);

    return (
        <div>
            <Outlet />
        </div>
    )
}

export default AppLayout