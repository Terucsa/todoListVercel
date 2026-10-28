import { useCallback, useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../api/client';
import {
  clearCompletedTodos,
  createTodo,
  deleteTodo as deleteTodoRequest,
  fetchTodos,
  updateTodo as updateTodoRequest,
} from '../api/todos';
import type { CreateTodoDTO, Todo, UpdateTodoDTO } from '../types/todo';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoCounts {
  all: number;
  active: number;
  completed: number;
}

function sortByNewest(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    setError(null);

    try {
      const data = await fetchTodos();
      setTodos(sortByNewest(data));
    } catch (err) {
      setError(getErrorMessage(err));
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addTodo = useCallback(async (dto: CreateTodoDTO): Promise<boolean> => {
    setError(null);

    try {
      const created = await createTodo(dto);
      setTodos((current) => sortByNewest([created, ...current]));
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  }, []);

  const editTodo = useCallback(async (id: string, dto: UpdateTodoDTO): Promise<boolean> => {
    setError(null);

    try {
      const updated = await updateTodoRequest(id, dto);
      setTodos((current) => current.map((todo) => (todo.id === updated.id ? updated : todo)));
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  }, []);

  const toggleTodo = useCallback(async (todo: Todo): Promise<void> => {
    setError(null);

    try {
      const updated = await updateTodoRequest(todo.id, { completed: !todo.completed });
      setTodos((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  const removeTodo = useCallback(async (id: string): Promise<void> => {
    setError(null);

    try {
      await deleteTodoRequest(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  const removeCompleted = useCallback(async (): Promise<void> => {
    setError(null);

    try {
      await clearCompletedTodos();
      setTodos((current) => current.filter((todo) => !todo.completed));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  const counts = useMemo<TodoCounts>(() => {
    const completed = todos.filter((todo) => todo.completed).length;

    return {
      all: todos.length,
      active: todos.length - completed,
      completed,
    };
  }, [todos]);

  const visibleTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [filter, todos]);

  return {
    todos,
    visibleTodos,
    counts,
    filter,
    setFilter,
    loading,
    error,
    loadFailed,
    clearError,
    reload,
    addTodo,
    updateTodo: editTodo,
    toggleTodo,
    deleteTodo: removeTodo,
    clearCompleted: removeCompleted,
  };
}
