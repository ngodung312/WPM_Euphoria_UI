// import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { axiosInstance } from './axiosConfig';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(
		JSON.parse(sessionStorage.getItem("user")) || null
	);

	const login = async (inputs) => {
		return axiosInstance
            .post("/v1/login", inputs)
            .then((res) => {
                setCurrentUser(res.data);
                return res;
            })
            .catch((err) => {
                return err;
            });
	};

	const register = async (inputs) => {
		return axiosInstance
            .post("/v1/register", inputs)
            .then((res) => {
                setCurrentUser(res.data);
                return res;
            })
            .catch((err) => {
                return err;
            });
	};

	const logout = () => {
		setCurrentUser(null); 
	}

	useEffect(() => {
		sessionStorage.setItem("user", JSON.stringify(currentUser));
	}, [currentUser]);

	return (
		<AuthContext.Provider value={{ currentUser, setCurrentUser, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};