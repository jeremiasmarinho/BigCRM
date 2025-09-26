import React, { useCallback, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useLeads, useLeadOperations } from "../hooks/useLeads";
import { useFilters, useModal } from "../hooks/useCommon";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../utils/constants";
import Button from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import LeadsTable from "../components/leads/LeadsTable";
import LeadFormModal from "../components/leads/LeadFormModal";
import LoadingSpinner from "../components/LoadingSpinner";
import type { LeadFilters, LeadFormData, Lead } from "../types";

const Leads: React.FC = () => {
  const { filters, updateFilter, goToPage } = useFilters<LeadFilters>({
    page: 1,
    limit: 10,
  });

  const { leads, pagination, isLoading, error, refetch } = useLeads(filters);
  const {
    createLead,
    updateLead,
    deleteLead,
    convertLead,
    isCreating,
    isUpdating,
    isDeleting,
    isConverting,
  } = useLeadOperations();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const createModal = useModal();
  const editModal = useModal();

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFilter("search", e.target.value);
    },
    [updateFilter]
  );

  const handleStatusFilter = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      updateFilter("status", (value as any) || undefined);
    },
    [updateFilter]
  );

  const handlePriorityFilter = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      updateFilter("priority", (value as any) || undefined);
    },
    [updateFilter]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm("Tem certeza que deseja deletar este lead?")) {
        deleteLead(id);
      }
    },
    [deleteLead]
  );

  const handleConvert = useCallback(
    (id: string) => {
      if (
        window.confirm(
          "Tem certeza que deseja converter este lead para cliente?"
        )
      ) {
        convertLead(id);
      }
    },
    [convertLead]
  );

  const handleEdit = useCallback(
    (lead: Lead) => {
      setSelectedLead(lead);
      editModal.openModal();
    },
    [editModal]
  );

  const handleCreateLead = useCallback(
    (data: LeadFormData) => {
      createLead(data, {
        onSuccess: () => {
          createModal.closeModal();
          refetch();
        },
      });
    },
    [createLead, createModal, refetch]
  );

  const handleUpdateLead = useCallback(
    (data: LeadFormData) => {
      if (!selectedLead?._id) return;

      updateLead(
        { id: selectedLead._id, data },
        {
          onSuccess: () => {
            editModal.closeModal();
            setSelectedLead(null);
            refetch();
          },
        }
      );
    },
    [updateLead, selectedLead, editModal, refetch]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      goToPage(page);
    },
    [goToPage]
  );

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erro ao carregar leads: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">
            {pagination
              ? `${pagination.totalItems} leads encontrados`
              : "Carregando..."}
          </p>
        </div>
        <Button
          onClick={createModal.openModal}
          leftIcon={<Plus size={20} />}
          loading={isCreating}
          disabled={isLoading}
        >
          Novo Lead
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar leads..."
              value={filters.search || ""}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status || ""}
            onChange={handleStatusFilter}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority || ""}
            onChange={handlePriorityFilter}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as prioridades</option>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <Button
            variant="outline"
            onClick={() => {
              updateFilter("search", "");
              updateFilter("status", undefined);
              updateFilter("priority", undefined);
            }}
            disabled={!filters.search && !filters.status && !filters.priority}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Tabela de Leads */}
      {!isLoading && (
        <>
          <LeadsTable
            leads={leads as any}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onConvert={handleConvert}
            isLoading={isDeleting || isConverting}
          />

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                total={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && leads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            {filters.search || filters.status || filters.priority
              ? "Nenhum lead encontrado com os filtros aplicados"
              : "Nenhum lead cadastrado ainda"}
          </div>
          <p className="text-gray-400 mb-4">
            {filters.search || filters.status || filters.priority
              ? "Tente ajustar os filtros ou criar um novo lead"
              : "Comece criando seu primeiro lead"}
          </p>
          <Button
            onClick={createModal.openModal}
            leftIcon={<Plus size={20} />}
            disabled={isCreating}
          >
            Criar Primeiro Lead
          </Button>
        </div>
      )}

      {/* Modal de Criação */}
      <LeadFormModal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        onSubmit={handleCreateLead}
        isLoading={isCreating}
      />

      {/* Modal de Edição */}
      <LeadFormModal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        onSubmit={handleUpdateLead}
        isLoading={isUpdating}
        lead={selectedLead as any}
      />
    </div>
  );
};

export default Leads;
