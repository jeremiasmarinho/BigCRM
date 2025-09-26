import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../../utils/constants";
import { Lead, LeadStatus, LeadPriority } from "../../types";

interface LeadFormData {
  name: string;
  email: string;
  description?: string;
  priority: LeadPriority;
  status: LeadStatus;
}

const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  description: yup.string().optional(),
  priority: yup.string().oneOf(["low", "medium", "high", "urgent"]).required(),
  status: yup
    .string()
    .oneOf([
      "new",
      "contacted",
      "qualified",
      "proposal",
      "negotiation",
      "won",
      "lost",
    ])
    .required(),
});

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  lead?: Lead | null;
  isLoading?: boolean;
}

/**
 * Modal para criar/editar leads
 */
const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lead = null,
  isLoading = false,
}) => {
  const isEditing = Boolean(lead);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: lead?.name || "",
      email: lead?.email || "",
      description: lead?.notes || "",
      priority: lead?.priority || "medium",
      status: lead?.status || "new",
    },
  });

  const handleClose = (): void => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: any): void => {
    onSubmit(data as LeadFormData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Editar Lead" : "Criar Novo Lead"}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            {...register("name")}
            type="text"
            className="input"
            placeholder="Nome completo do lead"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            {...register("email")}
            type="email"
            className="input"
            placeholder="email@exemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="input resize-none"
            placeholder="Informações adicionais sobre o lead..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Prioridade e Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridade *
            </label>
            <select {...register("priority")} className="input">
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">
                {errors.priority.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select {...register("status")} className="input">
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEditing ? "Atualizar" : "Criar"} Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LeadFormModal;
