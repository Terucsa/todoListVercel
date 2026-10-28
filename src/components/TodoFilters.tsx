import type { TodoCounts, TodoFilter } from '../hooks/useTodos';
import styles from './TodoFilters.module.css';

interface TodoFiltersProps {
  filter: TodoFilter;
  counts: TodoCounts;
  onChange: (filter: TodoFilter) => void;
}

const OPTIONS: Array<{ value: TodoFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
];

export function TodoFilters({ filter, counts, onChange }: TodoFiltersProps) {
  return (
    <div className={styles.filters} role="group" aria-label="Filtrar tareas">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`${styles.filter} ${filter === option.value ? styles.active : ''}`}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={filter === option.value}
        >
          {option.label}
          <span className={styles.count}>{counts[option.value]}</span>
        </button>
      ))}
    </div>
  );
}
