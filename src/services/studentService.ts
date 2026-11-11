
/**
 * Servicio de estudiantes.
 * Administra las consultas y la caché de estudiantes.
 */

import apiClient from '../api/client';
import { Student } from '../types/student';

class StudentService {
  private baseUrl = '/api/students';

  private cache = new Map<
    string,
    { data: any; timestamp: number }
  >();

  private readonly CACHE_TTL = 5 * 60 * 1000;
  private readonly MAX_CACHE_SIZE = 50;

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key);

    if (!cached) return false;

    return Date.now() - cached.timestamp < this.CACHE_TTL;
  }

  private cleanCache() {
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());

      entries.sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      );

      const toDelete = entries.slice(
        0,
        entries.length - this.MAX_CACHE_SIZE
      );

      toDelete.forEach(([key]) => {
        this.cache.delete(key);
      });
    }
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    this.cleanCache();
  }

  /**
   * Invalidar la caché de estudiantes.
   */
  invalidateCache(id?: number) {
    this.cache.delete('all-students');

    if (id !== undefined) {
      this.cache.delete(`student-${id}`);
    }
  }

  /**
   * Consultar todos los estudiantes.
   * forceRefresh = true obliga a consultar el servidor.
   */
  async getAll(forceRefresh = false): Promise<Student[]> {
    const cacheKey = 'all-students';

    if (!forceRefresh && this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    const response = await apiClient.get<{ data: Student[] }>(
      this.baseUrl
    );

    const students = response.data.data;

    this.setCache(cacheKey, students);

    return students;
  }

  /**
   * Consultar estudiante por ID.
   */
  async getById(id: number): Promise<Student> {
    const cacheKey = `student-${id}`;

    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    const response = await apiClient.get<{ data: Student }>(
      `${this.baseUrl}/${id}`
    );

    const student = response.data.data;

    this.setCache(cacheKey, student);

    return student;
  }

  /**
   * Registrar estudiante.
   */
  async create(
    student: Omit<Student, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Student> {
    const response = await apiClient.post<{ data: Student }>(
      this.baseUrl,
      student
    );

    const newStudent = response.data.data;

    this.cache.clear();

    return newStudent;
  }

  /**
   * Actualizar estudiante.
   */
  async update(
    id: number,
    student: Partial<Student>
  ): Promise<Student> {
    const response = await apiClient.put<{ data: Student }>(
      `${this.baseUrl}/${id}`,
      student
    );

    const updatedStudent = response.data.data;

    this.invalidateCache(id);

    return updatedStudent;
  }

  /**
   * Eliminar estudiante.
   */
  async delete(id: number): Promise<void> {
    const response = await apiClient.delete(
      `${this.baseUrl}/${id}`
    );

    console.log('Estudiante eliminado:', response.status);

    this.invalidateCache(id);
  }

  /**
   * Buscar estudiantes.
   */
  async search(query: string): Promise<Student[]> {
    const response = await apiClient.get<{ data: Student[] }>(
      `${this.baseUrl}/search`,
      {
        params: { q: query },
      }
    );

    return response.data.data;
  }
}

export const studentService = new StudentService();
