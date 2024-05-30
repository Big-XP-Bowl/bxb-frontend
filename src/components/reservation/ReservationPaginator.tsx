interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

const ReservationPaginator = (props: PaginationProps) => {
  const { currentPage, totalPages, handleNextPage, handlePrevPage } = props;

  return (
    <div>
      <button onClick={handlePrevPage} disabled={currentPage === 1}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default ReservationPaginator;
