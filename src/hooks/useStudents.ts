
/**
 * Hook personalizado para manejar la lista de estudiantes.
 * Solamente permite operaciones a usuarios de tipo "user".
 * Utiliza AuthContext para verificar los permisos.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuthContext } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { Student } from '../types/student';

interface UseStudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

interface UseStudentsReturn extends UseStudentsState {
  refresh: () => Promise<boolean>;
  deleteStudent: (id: number) => Promise<void>;
}

// Comparar estudiantes sin depender del orden de la lista.
function areStudentsEqual(
  first: Student[],
  second: Student[]
): boolean {
  const normalize = (students: Student[]) =>
    [...students]
      .sort((a, b) => a.id - b.id);

  return (
    JSON.stringify(normalize(first)) ===
    JSON.stringify(normalize(second))
  );
}

export function useStudents(): UseStudentsReturn {
  const { user, initializing } = useAuthContext();

  const canManageStudents = user?.kind === 'user';

  const [state, setState] = useState<UseStudentsState>({
    students: [],
    loading: false,
    error: null,
  });

  // Mantener una referencia actual de los estudiantes.
  const studentsRef = useRef<Student[]>([]);

  // Consultar estudiantes.
  const fetchStudents = useCallback(async (): Promise<boolean> => {
    if (initializing) {
      return false;
    }

    if (!canManageStudents) {
      setState({
        students: [],
        loading: false,
        error: user
          ? 'No tienes permiso para consultar estudiantes.'
          : null,
      });

      studentsRef.current = [];

      throw new Error(
        'No tienes permiso para consultar estudiantes.'
      );
    }

    setState(prev => ({
      ...prev,
      // No ocultar la lista mientras se actualiza.
      loading: prev.students.length === 0,
      error: null,
    }));

    try {
      const students = await studentService.getAll(true);

      // Comprobar si realmente existen cambios.
      const changed = !areStudentsEqual(
        studentsRef.current,
        students
      );

      studentsRef.current = students;

      setState({
        students,
        loading: false,
        error: null,
      });

      return changed;

    } catch (error) {
      console.error('ERROR AL CONSULTAR ESTUDIANTES:', error);

      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar estudiantes.',
      }));

      throw error;
    }
  }, [canManageStudents, initializing, user]);

  // Eliminar estudiante.
  const deleteStudent = useCallback(async (id: number) => {
    if (initializing || !canManageStudents) {
      throw new Error(
        'No tienes permiso para eliminar estudiantes.'
      );
    }

    let deletedStudent: Student | undefined;

    // Eliminación optimista.
    setState(prev => {
      deletedStudent = prev.students.find(
        student => student.id === id
      );

      const updatedStudents = prev.students.filter(
        student => student.id !== id
      );

      studentsRef.current = updatedStudents;

      return {
        ...prev,
        students: updatedStudents,
        error: null,
      };
    });

    try {
      await studentService.delete(id);

    } catch (error) {
      console.error('ERROR AL ELIMINAR ESTUDIANTE:', error);

      // Restaurar el estudiante si la operación falla.
      if (deletedStudent) {
        setState(prev => {
          const restoredStudents = prev.students.some(
            student => student.id === id
          )
            ? prev.students
            : [...prev.students, deletedStudent!];

          studentsRef.current = restoredStudents;

          return {
            ...prev,
            students: restoredStudents,
            error: 'Error al eliminar estudiante.',
          };
        });
      }

      throw error;
    }
  }, [canManageStudents, initializing]);

  // Carga inicial y cuando cambie la sesión.
  useEffect(() => {
    void fetchStudents().catch(() => {
      // El error ya se guarda en el estado.
    });
  }, [fetchStudents]);

  return {
    ...state,
    refresh: fetchStudents,
    deleteStudent,
  };
}
