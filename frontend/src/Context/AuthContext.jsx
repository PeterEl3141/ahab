import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext(null);



const ContextProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem("token"))


    useEffect(() => {
        if(token){
            localStorage.setItem("token", token)
        } else {
            localStorage.removeItem("token")
        }
    }, [token])

    const contextValue = {
        setToken,
        token
    }


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default ContextProvider;