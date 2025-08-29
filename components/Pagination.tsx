// components/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  mode?: "dark" | "light";
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  mode = "dark", // Default to dark mode
}: PaginationProps) => {
  const isDarkMode = mode === "dark";

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Define color classes based on mode
  const getButtonClasses = (
    isActive: boolean = false,
    isDisabled: boolean = false
  ) => {
    const baseClasses = "px-3 py-1 rounded-md transition-colors duration-200";

    if (isDisabled) {
      return `${baseClasses} ${isDarkMode ? "bg-white/20 text-white/50 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`;
    }

    if (isActive) {
      return `${baseClasses} font-bold ${
        isDarkMode ? "bg-white text-indigo-700" : "bg-indigo-600 text-white"
      }`;
    }

    return `${baseClasses} ${
      isDarkMode
        ? "bg-white/20 text-white hover:bg-white/30"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;
  };

  return (
    <div className="flex justify-center mt-12">
      <nav className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={getButtonClasses(false, currentPage === 1)}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={getButtonClasses(currentPage === page)}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={getButtonClasses(false, currentPage === totalPages)}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
