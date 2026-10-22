
import { API_URL } from "../constants/api";
import {
    LoginRequest,
    LoginResponse
} from "../interfaces/auth.interface";

export const loginService = async (
    data: LoginRequest
): Promise<LoginResponse> => {

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
            },
            body: JSON.stringify(data)
        }
    );

    const result = await response.json();

    if (!response.ok) {
        return {
            success: false,
            message: result.message || "Usuario o contraseña incorrectos"
        };
    }

    return {
        success: true,
        message: result.message || "Login correcto"
    };
};