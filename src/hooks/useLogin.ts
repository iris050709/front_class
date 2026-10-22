import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../store/store";
import { saveStorage } from "../utils/authStorage";

const API_URL = "http://localhost:3000";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || data.message || "Credenciales inválidas");
                return false;
            }

            // 🔑 Extraer accessToken proveniente del backend
            const tokenReceived = data.accessToken || data.token;

            if (!tokenReceived) {
                setError("La API no devolvió un token válido");
                return false;
            }

            let fullUser = {
                id: data.user?.id || 1,
                email: data.user?.email || email,
                nombre: "",
                apellido: "",
                matricula: "",
            };

            // Consulta a /api/students usando el accessToken para traer nombre y apellido
            try {
                const studentRes = await fetch(`${API_URL}/api/students`, {
                    headers: { 
                        "Accept": "application/json",
                        "Authorization": `Bearer ${tokenReceived}` 
                    },
                });

                if (studentRes.ok) {
                    const studentData = await studentRes.json();
                    const studentsList = Array.isArray(studentData) ? studentData : studentData.data;

                    if (Array.isArray(studentsList)) {
                        const match = studentsList.find(
                            (s: any) => s.email.toLowerCase() === email.toLowerCase()
                        );
                        if (match) {
                            fullUser.nombre = match.nombre;
                            fullUser.apellido = match.apellido;
                            fullUser.matricula = match.matricula;
                        }
                    }
                }
            } catch (err) {
                console.log("No se pudo obtener la lista de estudiantes:", err);
            }

            // Guardar en localStorage / SecureStore
            await saveStorage("user_token", tokenReceived);
            await saveStorage("user_info", JSON.stringify(fullUser));

            // Actualizar Redux
            dispatch(setToken(tokenReceived));
            dispatch(setUser(fullUser));

            return true;

        } catch (err) {
            console.error("Error durante el inicio de sesión:", err);
            setError("No se pudo conectar con el servidor");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};