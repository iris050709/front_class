export interface Student {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  createdAt?: string;
}

export interface CreateStudentData {
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  password: string;
}

export interface UpdateStudentData {
  nombre?: string;
  apellido?: string;
  matricula?: string;
  email?: string;
  password?: string;
}