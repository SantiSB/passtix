import React from 'react';

interface MessageProps {
  message: string;
}

export const SuccessMessage: React.FC<MessageProps> = ({ message }) => (
  <p className="text-emerald-700 font-semibold text-sm mt-4">
    ✅ {message}
  </p>
);

export const ErrorMessage: React.FC<MessageProps> = ({ message }) => (
  <p className="text-red-600 font-medium text-sm mt-2">
    ❌ {message}
  </p>
); 