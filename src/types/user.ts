/**
 * Tipos para el módulo de usuario
 */

export interface User {
  id: number;
  email: string;
  nombre?: string;
  apellido?: string;
  matricula?: string;
  kind: "user" | "student";
}

export interface UserMeResponse {
  data: User;
}
//formato que devuelve el backend en /api/auth/me