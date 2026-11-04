/**
 * Tipos para el módulo de estudiantes
 */

export interface Student {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface StudentListResponse {
  data: Student[];
}