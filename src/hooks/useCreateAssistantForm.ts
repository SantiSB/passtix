// useCreateAssistantForm.ts

import { useState } from 'react';

const useCreateAssistantForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    cellPhone: '',
    identificationCard: '',
    ticketType: 'General',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // Hacemos POST a la route de Next: "/api/assistants"
      const res = await fetch('/api/assistants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form), 
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        // Limpia el formulario
        setForm({
          name: '',
          email: '',
          cellPhone: '',
          identificationCard: '',
          ticketType: 'General',
        });
      } else {
        setError(data.error || 'Ocurrió un error inesperado');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        console.error('Unexpected error', err);
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    success,
    error,
    handleChange,
    handleSubmit,
  };
};

export default useCreateAssistantForm;
