import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Todo, UpdateTodoDTO } from '../types/todo';
import { formatDate } from '../utils/formatDate';
import { PencilIcon, TrashIcon } from './Icons';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => Promise<void>;
  onUpdate: (id: string, dto: UpdateTodoDTO) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? '');
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditing]);

  function startEditing(): void {
    setTitle(todo.title);
    setDescription(todo.description ?? '');
    setValidationError(null);
    setIsEditing(true);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationError('El título no puede estar vacío.');
      titleInputRef.current?.focus();
      return;
    }

    setValidationError(null);
    setSaving(true);

    const updated = await onUpdate(todo.id, {
      title: trimmedTitle,
      description: description.trim(),
    });

    setSaving(false);

    if (updated) {
      setIsEditing(false);
    }
  }

  function handleDelete(): void {
    if (window.confirm(`¿Eliminar la tarea «${todo.title}»?`)) {
      void onDelete(todo.id);
    }
  }

  const createdLabel = formatDate(todo.createdAt);

  return (
    <li className={styles.item}>
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={todo.completed}
        onChange={() => void onToggle(todo)}
        aria-label={
          todo.completed
            ? `Marcar «${todo.title}» como pendiente`
            : `Marcar «${todo.title}» como completada`
        }
      />

      {isEditing ? (
        <form
          className={styles.editForm}
          onSubmit={(event) => void handleSave(event)}
          noValidate
        >
          <input
            ref={titleInputRef}
            className={styles.editInput}
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (validationError) setValidationError(null);
            }}
            aria-label="Título de la tarea"
            aria-invalid={Boolean(validationError)}
            maxLength={120}
          />
          <textarea
            className={`${styles.editInput} ${styles.editTextarea}`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            aria-label="Descripción de la tarea"
            placeholder="Descripción (opcional)"
            maxLength={1000}
            rows={2}
          />
          {validationError && (
            <p className={styles.editError} role="alert">
              {validationError}
            </p>
          )}
          <div className={styles.editActions}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              Cancelar
            </button>
            <button className={styles.saveButton} type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className={`${styles.content} ${todo.completed ? styles.completed : ''}`}>
            <span className={styles.title}>{todo.title}</span>
            {todo.description && <p className={styles.description}>{todo.description}</p>}
            {createdLabel && <span className={styles.meta}>Creada el {createdLabel}</span>}
          </div>
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              type="button"
              onClick={startEditing}
              aria-label={`Editar «${todo.title}»`}
              title="Editar"
            >
              <PencilIcon />
            </button>
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              type="button"
              onClick={handleDelete}
              aria-label={`Eliminar «${todo.title}»`}
              title="Eliminar"
            >
              <TrashIcon />
            </button>
          </div>
        </>
      )}
    </li>
  );
}
