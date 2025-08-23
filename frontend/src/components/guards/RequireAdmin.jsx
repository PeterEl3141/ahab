import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Navigate } from "react-router-dom";


export default function RequrieAdmin({children}){
    const { user } = useContext(AuthContext);
    if(!user) return <Navigate to="/" replace />;
    if(user.role !== 'ADMIN') return <Navigate to="/" replace />;
    return children;
}