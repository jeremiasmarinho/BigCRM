import React from "react";
import { useParams } from "react-router-dom";

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Detalhes do Cliente</h1>
      <div className="card">
        <p>Página em desenvolvimento - Cliente ID: {id}</p>
      </div>
    </div>
  );
};

export default ClientDetail;
