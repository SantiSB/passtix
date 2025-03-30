import React from 'react';

interface FormActionsProps {
  onClose: () => void;
  loading: boolean;
  loadingOptions: boolean;
  loadingPromoters: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onClose,
  loading,
  loadingOptions,
  loadingPromoters,
}) => (
  <div className="flex justify-between mt-6">
    <button
      type="submit"
      disabled={loading || loadingOptions || loadingPromoters}
      className="bg-emerald-800 text-white px-5 py-2 rounded-md hover:bg-emerald-700"
    >
      {loading ? "Registrando..." : "Registrar"}
    </button>
    <button
      type="button"
      onClick={onClose}
      className="bg-red-800 text-white px-5 py-2 rounded-md hover:bg-red-700"
    >
      Cerrar
    </button>
  </div>
);

export default FormActions; 