'use client';

import { useState } from 'react';
import { registerAssistantWithTicket } from '@/lib/actions/registerAssistantWithTicket';
import {
  IdentificationType,
  TicketType,
  DeliveryMethod
} from '@/types/enums';

type FormData = {
  name: string;
  email: string;
  phoneNumber: string;
  identificationNumber: string;
  identificationType: IdentificationType;
  eventId: string;
  phaseId: string;
  ticketType: TicketType;
  localityId: string;
  price: number;
  promoterId?: string;
  deliveryMethod?: DeliveryMethod;
  discountId?: string;
  discountAmount?: number;
};

const useCreateAssistantForm = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    identificationNumber: '',
    identificationType: 'cc',
    eventId: '',
    phaseId: '',
    ticketType: 'ticket',
    localityId: '',
    price: 0,
    promoterId: '',
    deliveryMethod: 'manual',
    discountId: '',
    discountAmount: 0
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Parsear tipos numéricos si es necesario
    const parsedValue = name === 'price' || name === 'discountAmount'
      ? Number(value)
      : value;

    setForm({ ...form, [name]: parsedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await registerAssistantWithTicket(form);
      setSuccess(true);
      // Reiniciar formulario
      setForm({
        name: '',
        email: '',
        phoneNumber: '',
        identificationNumber: '',
        identificationType: 'cc',
        eventId: '',
        phaseId: '',
        ticketType: 'ticket',
        localityId: '',
        price: 0,
        promoterId: '',
        deliveryMethod: 'manual',
        discountId: '',
        discountAmount: 0
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al crear el asistente.');
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
    handleSubmit
  };
};

export default useCreateAssistantForm;
