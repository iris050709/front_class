/**
 * API de estudiantes
 * Funciones para comunicarse con los endpoints de estudiantes del backend
 */

import { Student, StudentListResponse } from '../types/student';
import apiClient from './client';

/**
 * Obtiene la lista de todos los estudiantes
 * Requiere autenticación (token JWT)
 */
export async function getStudents(): Promise<Student[]> {
  const response = await apiClient.get<StudentListResponse>('/api/students');
  return response.data.data;
}

/**
 * Obtiene un estudiante por su ID
 * @param id - ID del estudiante
 */
export async function getStudentById(id: number): Promise<Student> {
  const response = await apiClient.get<{ data: Student }>(`/api/students/${id}`);
  return response.data.data;
}

/**
 * Crea un nuevo estudiante
 * @param student - Datos del estudiante (sin ID)
 */
export async function createStudent(
  student: Omit<Student, 'id' | 'created_at' | 'updated_at'> & {
    password: string;
  }
): Promise<Student> {
  const response = await apiClient.post<{ data: Student }>(
    '/api/students',
    student
  );

  return response.data.data;
}

/**
 * Actualiza un estudiante existente
 * @param id - ID del estudiante
 * @param student - Datos actualizados
 */
export async function updateStudent(id: number, student: Partial<Student>): Promise<Student> {
  const response = await apiClient.put<{ data: Student }>(`/api/students/${id}`, student);
  return response.data.data;
}

/**
 * Elimina un estudiante
 * @param id - ID del estudiante a eliminar
 */
export async function deleteStudent(id: number): Promise<void> {
  await apiClient.delete(`/api/students/${id}`);
}