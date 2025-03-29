'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

type Option = {
  id: string;
  name: string;
};

const useEventOptions = () => {
  const [events, setEvents] = useState<Option[]>([]);
  const [phases, setPhases] = useState<Option[]>([]);
  const [localities, setLocalities] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [eventsSnap, phasesSnap, localitiesSnap] = await Promise.all([
          getDocs(collection(db, 'event')),
          getDocs(collection(db, 'phase')),
          getDocs(collection(db, 'locality'))
        ]);

        setEvents(
          eventsSnap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name
          }))
        );

        setPhases(
          phasesSnap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name
          }))
        );

        setLocalities(
          localitiesSnap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name
          }))
        );
      } catch (error) {
        console.error('Error al cargar eventos/fases/localidades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return {
    loading,
    events,
    phases,
    localities
  };
};

export default useEventOptions;
