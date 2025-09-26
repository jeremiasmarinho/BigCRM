/**
 * Utilitários de formatação com tipagem TypeScript
 */

/**
 * Formata valor monetário em Real brasileiro
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  options: Intl.NumberFormatOptions = {}
): string => {
  if (value === null || value === undefined || value === "") return "R$ 0,00";

  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numericValue)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(numericValue);
};

/**
 * Formata número com separadores de milhares
 */
export const formatNumber = (
  value: number | string | null | undefined,
  options: Intl.NumberFormatOptions = {}
): string => {
  if (value === null || value === undefined || value === "") return "0";

  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numericValue)) return "0";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(numericValue);
};

/**
 * Formata porcentagem
 */
export const formatPercentage = (
  value: number | string | null | undefined,
  decimals: number = 1
): string => {
  if (value === null || value === undefined || value === "") return "0%";

  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numericValue)) return "0%";

  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numericValue / 100);
};

/**
 * Formata telefone brasileiro
 */
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return "";

  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, "");

  // Formata baseado no tamanho
  if (cleanPhone.length === 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (cleanPhone.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleanPhone.length === 8) {
    // Telefone sem DDD: XXXX-XXXX
    return cleanPhone.replace(/(\d{4})(\d{4})/, "$1-$2");
  } else if (cleanPhone.length === 9) {
    // Celular sem DDD: XXXXX-XXXX
    return cleanPhone.replace(/(\d{5})(\d{4})/, "$1-$2");
  }

  return phone; // Retorna original se não conseguir formatar
};

/**
 * Formata CPF
 */
export const formatCPF = (cpf: string | null | undefined): string => {
  if (!cpf) return "";

  const cleanCPF = cpf.replace(/\D/g, "");

  if (cleanCPF.length === 11) {
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  return cpf;
};

/**
 * Formata CNPJ
 */
export const formatCNPJ = (cnpj: string | null | undefined): string => {
  if (!cnpj) return "";

  const cleanCNPJ = cnpj.replace(/\D/g, "");

  if (cleanCNPJ.length === 14) {
    return cleanCNPJ.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  return cnpj;
};

/**
 * Formata CEP
 */
export const formatCEP = (cep: string | null | undefined): string => {
  if (!cep) return "";

  const cleanCEP = cep.replace(/\D/g, "");

  if (cleanCEP.length === 8) {
    return cleanCEP.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  return cep;
};

/**
 * Capitaliza primeira letra de cada palavra
 */
export const capitalizeWords = (text: string | null | undefined): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

/**
 * Capitaliza apenas a primeira letra
 */
export const capitalize = (text: string | null | undefined): string => {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Trunca texto com reticências
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number = 50,
  suffix: string = "..."
): string => {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength - suffix.length).trim() + suffix;
};

/**
 * Remove acentos de uma string
 */
export const removeAccents = (text: string | null | undefined): string => {
  if (!text) return "";

  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Gera slug a partir de um texto
 */
export const generateSlug = (text: string | null | undefined): string => {
  if (!text) return "";

  return removeAccents(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
    .replace(/[\s_-]+/g, "-") // Substitui espaços por hífens
    .replace(/^-+|-+$/g, ""); // Remove hífens do início e fim
};

/**
 * Formata tamanho de arquivo
 */
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes || bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Mascaras para inputs
 */
export const masks = {
  /**
   * Aplica máscara de telefone durante digitação
   */
  phone: (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length <= 10) {
      return cleanValue.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      return cleanValue.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
  },

  /**
   * Aplica máscara de CPF durante digitação
   */
  cpf: (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
  },

  /**
   * Aplica máscara de CNPJ durante digitação
   */
  cnpj: (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
      "$1.$2.$3/$4-$5"
    );
  },

  /**
   * Aplica máscara de CEP durante digitação
   */
  cep: (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue.replace(/(\d{5})(\d{0,3})/, "$1-$2");
  },

  /**
   * Aplica máscara de moeda durante digitação
   */
  currency: (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");
    const numericValue = parseInt(cleanValue) / 100;

    if (isNaN(numericValue)) return "";

    return formatCurrency(numericValue);
  },
};

/**
 * Validadores de formato
 */
export const validators = {
  /**
   * Valida email
   */
  email: (email: string | null | undefined): boolean => {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida telefone brasileiro
   */
  phone: (phone: string | null | undefined): boolean => {
    if (!phone) return false;

    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  },

  /**
   * Valida CPF
   */
  cpf: (cpf: string | null | undefined): boolean => {
    if (!cpf) return false;

    const cleanCPF = cpf.replace(/\D/g, "");

    if (cleanCPF.length !== 11) return false;

    // Verifica se não são todos dígitos iguais
    if (/^(\d)\1+$/.test(cleanCPF)) return false;

    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

    return true;
  },

  /**
   * Valida CNPJ
   */
  cnpj: (cnpj: string | null | undefined): boolean => {
    if (!cnpj) return false;

    const cleanCNPJ = cnpj.replace(/\D/g, "");

    if (cleanCNPJ.length !== 14) return false;

    // Verifica se não são todos dígitos iguais
    if (/^(\d)\1+$/.test(cleanCNPJ)) return false;

    // Validação dos dígitos verificadores
    let size = cleanCNPJ.length - 2;
    let numbers = cleanCNPJ.substring(0, size);
    const digits = cleanCNPJ.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cleanCNPJ.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  },

  /**
   * Valida CEP
   */
  cep: (cep: string | null | undefined): boolean => {
    if (!cep) return false;

    const cleanCEP = cep.replace(/\D/g, "");
    return cleanCEP.length === 8;
  },
};

/**
 * Extrai apenas números de uma string
 */
export const extractNumbers = (text: string | null | undefined): string => {
  if (!text) return "";
  return text.replace(/\D/g, "");
};

/**
 * Sanitiza string removendo caracteres especiais
 */
export const sanitizeString = (text: string | null | undefined): string => {
  if (!text) return "";

  return text
    .trim()
    .replace(/[<>"']/g, "") // Remove caracteres potencialmente perigosos
    .replace(/\s+/g, " "); // Normaliza espaços
};

/**
 * Converte string para boolean de forma inteligente
 */
export const parseBoolean = (value: any): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lowerValue = value.toLowerCase().trim();
    return (
      lowerValue === "true" ||
      lowerValue === "1" ||
      lowerValue === "yes" ||
      lowerValue === "sim"
    );
  }
  if (typeof value === "number") return value !== 0;
  return Boolean(value);
};
