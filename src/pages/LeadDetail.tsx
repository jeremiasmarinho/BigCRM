import React from "react";
import { useParams } from "react-router-dom";

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Detalhes do Lead</h1>
      <div className="card">
        <p>Página em desenvolvimento - Lead ID: {id}</p>
      </div>
    </div>
  );
};

export default LeadDetail;
