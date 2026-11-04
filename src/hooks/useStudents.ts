
/**
 * Hook personalizado para manejar la lista de estudiantes.
 * Solamente permite operaciones a usuarios de tipo "user".
 */

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { studentService } from "../services/studentService";
import { RootState } from "../store/store";
import { Student } from "../types/student";

interface UseStudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

interface UseStudentsReturn extends UseStudentsState {
  refresh: () => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
}

export function useStudents(): UseStudentsReturn {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const canManageStudents = user?.kind === "user";

  const [state, setState] = useState<UseStudentsState>({
    students: [],
    loading: false,
    error: null,
  });

  const fetchStudents = useCallback(async () => {
    if (!canManageStudents) {
      setState({
        students: [],
        loading: false,
        error: "No tienes permiso para consultar estudiantes.",
      });
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const students = await studentService.getAll();

      setState({
        students,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Error al cargar estudiantes.",
      }));
    }
  }, [canManageStudents]);

  const deleteStudent = useCallback(async (id: number) => {
    if (!canManageStudents) {
      setState(prev => ({
        ...prev,
        error: "No tienes permiso para eliminar estudiantes.",
      }));
      return;
    }

    try {
      await studentService.delete(id);

      setState(prev => ({
        ...prev,
        students: prev.students.filter(student => student.id !== id),
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: "Error al eliminar estudiante.",
      }));
    }
  }, [canManageStudents]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    ...state,
    refresh: fetchStudents,
    deleteStudent,
  };
}
