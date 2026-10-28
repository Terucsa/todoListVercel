import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateTodoDTO } from '../types/todo';
import { PlusIcon } from './Icons';
import styles from './TodoForm.module.css';

interface TodoFormProps {
  onSubmit: (dto: CreateTodoDTO) => Promise<boolean>;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationError('Escribe un título para la tarea.');
      titleRef.current?.focus();
      return;
    }

    setValidationError(null);
    setSubmitting(true);

    const created = await onSubmit({
      title: trimmedTitle,
      description: description.trim() || undefined,
    });

    setSubmitting(false);

    if (created) {
      setTitle('');
      setDescription('');
      titleRef.current?.focus();
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
    >
      <div className={styles.inputs}>
        <input
          ref={titleRef}
          className={styles.titleInput}
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (validationError) setValidationError(null);
          }}
          placeholder="¿Qué necesitas hacer?"
          aria-label="Título de la tarea"
          aria-invalid={Boolean(validationError)}
          maxLength={120}
          autoComplete="off"
        />
        <textarea
          className={styles.descriptionInput}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Añade una descripción (opcional)"
          aria-label="Descripción de la tarea"
          maxLength={1000}
          rows={2}
        />
      </div>

      <div className={styles.actions}>
        {validationError && (
          <p className={styles.error} role="alert">
            {validationError}
          </p>
        )}
        <button className={styles.submit} type="submit" disabled={submitting}>
          <PlusIcon />
          {submitting ? 'Añadiendo…' : 'Añadir tarea'}
        </button>
      </div>
    </form>
  );
}
