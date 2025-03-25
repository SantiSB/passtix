'use client';

import { useEffect, useState } from 'react';
import { getAssistants } from '@/lib/assistant';
import { Assistant } from '@/types/Assistant';

const useAssistants = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);

  useEffect(() => {
    const fetchAssistants = async () => {
      const data = await getAssistants();
      setAssistants(data);
    };
    fetchAssistants();
  }, []);

  return assistants;
};

export default useAssistants; 