import {
  format,
  parseISO,
  isValid,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isTomorrow,
} from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Tipo para datas válidas que podem ser processadas
 */
type DateInput = string | number | Date;

/**
 * Verifica se uma data é válida
 */
export const isValidDate = (date: DateInput): boolean => {
  if (!date) return false;

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    return isValid(dateObj);
  } catch {
    return false;
  }
};

/**
 * Converte entrada de data para objeto Date
 */
const parseDate = (date: DateInput): Date | null => {
  if (!date) return null;

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    return isValid(dateObj) ? dateObj : null;
  } catch {
    return null;
  }
};

/**
 * Formata uma data para exibição
 */
export const formatDate = (
  date: DateInput,
  formatString: string = "dd/MM/yyyy"
): string => {
  const dateObj = parseDate(date);
  if (!dateObj) return "";

  try {
    return format(dateObj, formatString, { locale: ptBR });
  } catch (error) {
    console.warn("Error formatting date:", error);
    return "";
  }
};

/**
 * Formata uma data com horário
 */
export const formatDateTime = (date: DateInput): string => {
  return formatDate(date, "dd/MM/yyyy HH:mm");
};

/**
 * Formata uma data relativa (ex: "há 2 dias")
 */
export const formatRelativeDate = (date: DateInput): string => {
  const dateObj = parseDate(date);
  if (!dateObj) return "";

  try {
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: ptBR,
    });
  } catch (error) {
    console.warn("Error formatting relative date:", error);
    return "";
  }
};

/**
 * Formata data de forma inteligente baseada na proximidade com hoje
 */
export const formatSmartDate = (date: DateInput): string => {
  const dateObj = parseDate(date);
  if (!dateObj) return "";

  try {
    if (isToday(dateObj)) {
      return `Hoje às ${format(dateObj, "HH:mm", { locale: ptBR })}`;
    }

    if (isYesterday(dateObj)) {
      return `Ontem às ${format(dateObj, "HH:mm", { locale: ptBR })}`;
    }

    if (isTomorrow(dateObj)) {
      return `Amanhã às ${format(dateObj, "HH:mm", { locale: ptBR })}`;
    }

    // Para datas mais distantes, mostrar data completa
    const diffInDays = Math.abs(
      (new Date().getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays <= 7) {
      return `${format(dateObj, "EEEE", { locale: ptBR })} às ${format(
        dateObj,
        "HH:mm",
        { locale: ptBR }
      )}`;
    }

    return formatDateTime(dateObj);
  } catch (error) {
    console.warn("Error formatting smart date:", error);
    return formatDate(date);
  }
};

/**
 * Formata data para input HTML date
 */
export const formatDateForInput = (date: DateInput): string => {
  const dateObj = parseDate(date);
  if (!dateObj) return "";

  try {
    return format(dateObj, "yyyy-MM-dd");
  } catch (error) {
    console.warn("Error formatting date for input:", error);
    return "";
  }
};

/**
 * Formata datetime para input HTML datetime-local
 */
export const formatDateTimeForInput = (date: DateInput): string => {
  const dateObj = parseDate(date);
  if (!dateObj) return "";

  try {
    return format(dateObj, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    console.warn("Error formatting datetime for input:", error);
    return "";
  }
};

/**
 * Formata hora apenas
 */
export const formatTime = (date: DateInput): string => {
  return formatDate(date, "HH:mm");
};

/**
 * Formata data no formato brasileiro longo
 */
export const formatLongDate = (date: DateInput): string => {
  return formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy");
};

/**
 * Formata data no formato brasileiro médio
 */
export const formatMediumDate = (date: DateInput): string => {
  return formatDate(date, "dd 'de' MMM, yyyy");
};

/**
 * Formata data no formato curto
 */
export const formatShortDate = (date: DateInput): string => {
  return formatDate(date, "dd/MM/yy");
};

/**
 * Retorna a data atual formatada
 */
export const getCurrentDate = (formatString?: string): string => {
  return formatDate(new Date(), formatString);
};

/**
 * Retorna a data e hora atual formatada
 */
export const getCurrentDateTime = (): string => {
  return formatDateTime(new Date());
};

/**
 * Verifica se duas datas são do mesmo dia
 */
export const isSameDay = (date1: DateInput, date2: DateInput): boolean => {
  const dateObj1 = parseDate(date1);
  const dateObj2 = parseDate(date2);

  if (!dateObj1 || !dateObj2) return false;

  return format(dateObj1, "yyyy-MM-dd") === format(dateObj2, "yyyy-MM-dd");
};

/**
 * Adiciona dias a uma data
 */
export const addDays = (date: DateInput, days: number): Date | null => {
  const dateObj = parseDate(date);
  if (!dateObj) return null;

  const newDate = new Date(dateObj);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

/**
 * Subtrai dias de uma data
 */
export const subtractDays = (date: DateInput, days: number): Date | null => {
  return addDays(date, -days);
};

/**
 * Retorna o início do dia para uma data
 */
export const startOfDay = (date: DateInput): Date | null => {
  const dateObj = parseDate(date);
  if (!dateObj) return null;

  const newDate = new Date(dateObj);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Retorna o fim do dia para uma data
 */
export const endOfDay = (date: DateInput): Date | null => {
  const dateObj = parseDate(date);
  if (!dateObj) return null;

  const newDate = new Date(dateObj);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Calcula a diferença em dias entre duas datas
 */
export const daysBetween = (
  date1: DateInput,
  date2: DateInput
): number | null => {
  const dateObj1 = parseDate(date1);
  const dateObj2 = parseDate(date2);

  if (!dateObj1 || !dateObj2) return null;

  const diffTime = Math.abs(dateObj2.getTime() - dateObj1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Formatos de data comuns exportados como constantes
 */
export const DATE_FORMATS = {
  SHORT: "dd/MM/yy",
  MEDIUM: "dd/MM/yyyy",
  LONG: "EEEE, dd 'de' MMMM 'de' yyyy",
  TIME: "HH:mm",
  DATETIME: "dd/MM/yyyy HH:mm",
  ISO: "yyyy-MM-dd",
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  INPUT_DATE: "yyyy-MM-dd",
  INPUT_DATETIME: "yyyy-MM-dd'T'HH:mm",
} as const;
