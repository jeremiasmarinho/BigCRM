import React, { HTMLAttributes } from "react";
import {
  STATUS_BADGE_CLASSES,
  PRIORITY_BADGE_CLASSES,
  STATUS_LABELS,
  PRIORITY_LABELS,
} from "../../utils/constants";
import { LeadStatus, LeadPriority } from "../../types";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

/**
 * Componente Badge reutilizável
 */
const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className = "",
  ...props
}) => {
  const baseClasses = "badge";
  const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

/**
 * Badge específico para status de lead
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  if (!status) return null;

  const badgeClass = STATUS_BADGE_CLASSES[status] || "badge-default";
  const label = STATUS_LABELS[status] || status;

  return <span className={`badge ${badgeClass} ${className}`}>{label}</span>;
};

interface PriorityBadgeProps {
  priority: LeadPriority;
  className?: string;
}

/**
 * Badge específico para prioridade de lead
 */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className = "",
}) => {
  if (!priority) return null;

  const badgeClass = PRIORITY_BADGE_CLASSES[priority] || "badge-default";
  const label = PRIORITY_LABELS[priority] || priority;

  return <span className={`badge ${badgeClass} ${className}`}>{label}</span>;
};

export default Badge;
