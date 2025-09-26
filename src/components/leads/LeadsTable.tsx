import React from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, ExternalLink, Users } from "lucide-react";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import Button from "../ui/Button";
import { formatDate } from "../../utils/dateUtils";
import { Lead } from "../../types";

interface LeadsTableProps {
  leads?: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onConvert: (leadId: string) => void;
  isLoading?: boolean;
}

/**
 * Tabela de leads reutilizável
 */
const LeadsTable: React.FC<LeadsTableProps> = ({
  leads = [],
  onEdit,
  onDelete,
  onConvert,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: 6 }).map((_, index) => (
                  <th key={index} className="px-6 py-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Nenhum lead encontrado
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Comece criando um novo lead ou ajuste os filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lead
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prioridade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Criado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Criado por
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <Link
                    to={`/leads/${lead._id}`}
                    className="text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors"
                  >
                    {lead.name}
                  </Link>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  {lead.notes && (
                    <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                      {lead.notes}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PriorityBadge priority={lead.priority} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lead.assignedTo?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    to={`/leads/${lead._id}`}
                    className="text-teal-600 hover:text-teal-900 transition-colors"
                    title="Ver detalhes"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  <button
                    onClick={() => onEdit(lead)}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                    title="Editar lead"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  {lead.status !== "won" && lead.status !== "lost" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onConvert(lead._id)}
                      className="text-green-600 hover:text-green-900 px-2 py-1"
                      title="Converter para cliente"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  )}

                  <button
                    onClick={() => onDelete(lead._id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Deletar lead"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
