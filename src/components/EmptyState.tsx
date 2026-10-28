import type { TodoFilter } from '../hooks/useTodos';
import { ClipboardCheckIcon } from './Icons';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  filter: TodoFilter;
  hasTodos: boolean;
}

function getCopy(filter: TodoFilter, hasTodos: boolean): { title: string; text: string } {
  if (filter === 'active') {
    return hasTodos
      ? { title: 'Todo al día', text: 'No te quedan tareas pendientes. Disfruta el descanso.' }
      : { title: 'Nada pendiente', text: 'Añade tu primera tarea con el formulario de arriba.' };
  }

  if (filter === 'completed') {
    return {
      title: 'Sin tareas completadas',
      text: 'Cuando marques una tarea como completada aparecerá aquí.',
    };
  }

  return {
    title: 'Tu lista está vacía',
    text: 'Añade tu primera tarea con el formulario de arriba.',
  };
}

export function EmptyState({ filter, hasTodos }: EmptyStateProps) {
  const copy = getCopy(filter, hasTodos);

  return (
    <div className={styles.empty}>
      <span className={styles.iconWrap}>
        <ClipboardCheckIcon />
      </span>
      <p className={styles.title}>{copy.title}</p>
      <p className={styles.text}>{copy.text}</p>
    </div>
  );
}
