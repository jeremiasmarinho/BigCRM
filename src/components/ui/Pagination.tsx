import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  total?: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  showInfo?: boolean;
  className?: string;
}

/**
 * Componente de paginação reutilizável
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  itemsPerPage = 10,
  showInfo = true,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const handlePrevious = (): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (): void => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  return (
    <div
      className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 ${className}`}
    >
      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage <= 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
        >
          Próximo
        </Button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {showInfo && (
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{startItem}</span> a{" "}
              <span className="font-medium">{endItem}</span> de{" "}
              <span className="font-medium">{total}</span> resultados
            </p>
          </div>
        )}

        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage <= 1}
              className="rounded-r-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              let pageNumber: number;

              if (totalPages <= 5) {
                pageNumber = index + 1;
              } else if (currentPage <= 3) {
                pageNumber = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + index;
              } else {
                pageNumber = currentPage - 2 + index;
              }

              const isActive = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`
                    relative inline-flex items-center px-4 py-2 text-sm font-medium border
                    ${
                      isActive
                        ? "z-10 bg-teal-50 border-teal-500 text-teal-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }
                  `}
                >
                  {pageNumber}
                </button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="rounded-l-none"
            >
              <span className="sr-only">Próximo</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
