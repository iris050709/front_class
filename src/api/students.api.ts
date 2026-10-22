import { apiClient } from './client';
import { Student, CreateStudentData, UpdateStudentData } from '../types/student';

export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const response = await apiClient.get<{ data: Student[] }>('/students');
    return response.data.data;
  },

  getById: async (id: number): Promise<Student> => {
    const response = await apiClient.get<{ data: Student }>(`/students/${id}`);
    return response.data.data;
  },

  create: async (data: CreateStudentData): Promise<Student> => {
    const response = await apiClient.post<{ data: Student }>('/students', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateStudentData): Promise<Student> => {
    const response = await apiClient.put<{ data: Student }>(`/students/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },
};