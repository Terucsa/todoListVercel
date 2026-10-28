import { EmptyState } from './components/EmptyState';
import { TodoFilters } from './components/TodoFilters';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';
import { useTodos } from './hooks/useTodos';
import styles from './App.module.css';

function getTodayLabel(): string {
  const formatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function App() {
  const {
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
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  } = useTodos();

  const progress = counts.all === 0 ? 0 : Math.round((counts.completed / counts.all) * 100);

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Lista de tareas</h1>
          <p className={styles.subtitle}>Organiza tu día, una tarea a la vez.</p>
        </div>
        <span className={styles.date}>{getTodayLabel()}</span>
      </header>

      <TodoForm onSubmit={addTodo} />

      {error && !loadFailed && (
        <div className={styles.error} role="alert">
          <span>{error}</span>
          <button type="button" onClick={clearError}>
            Cerrar
          </button>
        </div>
      )}

      <section className={styles.card} aria-label="Tareas">
        <TodoFilters filter={filter} counts={counts} onChange={setFilter} />

        {loading ? (
          <div className={styles.loading} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <span>Cargando tareas…</span>
          </div>
        ) : loadFailed ? (
          <div className={styles.loadError}>
            <p>{error ?? 'No se pudieron cargar las tareas.'}</p>
            <button type="button" onClick={() => void reload()}>
              Reintentar
            </button>
          </div>
        ) : visibleTodos.length === 0 ? (
          <EmptyState filter={filter} hasTodos={todos.length > 0} />
        ) : (
          <ul className={styles.list}>
            {visibleTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
        )}

        {!loading && !loadFailed && todos.length > 0 && (
          <footer className={styles.footer}>
            <div className={styles.progressTrack} aria-hidden="true">
              <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.footerContent}>
              <p className={styles.stats}>
                <strong>{counts.completed}</strong> de <strong>{counts.all}</strong> completadas
              </p>
              {counts.completed > 0 && (
                <button
                  className={styles.clearButton}
                  type="button"
                  onClick={() => void clearCompleted()}
                >
                  Eliminar completadas
                </button>
              )}
            </div>
          </footer>
        )}
      </section>

      <p className={styles.hint}>
        Demo con almacenamiento en memoria: las tareas se reinician al reiniciar la API.
      </p>
    </main>
  );
}

export default App;
