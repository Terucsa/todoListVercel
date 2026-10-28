import type { CreateTodoDTO, Todo, UpdateTodoDTO } from '../types/todo';
import { api } from './client';

export async function fetchTodos(): Promise<Todo[]> {
  const { data } = await api.get<Todo[]>('/todos');
  return data;
}

export async function createTodo(dto: CreateTodoDTO): Promise<Todo> {
  const { data } = await api.post<Todo>('/todos', dto);
  return data;
}

export async function updateTodo(id: string, dto: UpdateTodoDTO): Promise<Todo> {
  const { data } = await api.patch<Todo>(`/todos/${id}`, dto);
  return data;
}

export async function deleteTodo(id: string): Promise<void> {
  await api.delete(`/todos/${id}`);
}

export async function clearCompletedTodos(): Promise<void> {
  await api.delete('/todos/completed');
}
