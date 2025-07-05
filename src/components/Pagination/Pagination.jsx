import React from 'react';
import { Container, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { fetchWithUrl } from '../../services/api';


export const PaginationComponent = ({items, setItems}) => {
    const pageNumbers = [];
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 200;
    for (let i = 1; i <= Math.ceil(items.count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = async (pageNumber) => {
        if(pageNumber === currentPage) {
          return;
        }
        const nextOrPrevious = pageNumber > currentPage ? 'next' : 'previous';
        setCurrentPage(pageNumber);
        const data =  await fetchWithUrl(items[nextOrPrevious]);
        if (data) {
            setItems(data);
        }
    };



      return (
        <Container style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
            <Pagination>
                {pageNumbers.map(number => (
                    <PaginationItem key={number} active={number === currentPage}>
                        <PaginationLink onClick={() => handlePageChange(number)}>
                            {number}
                        </PaginationLink>
                    </PaginationItem>
                ))}
            </Pagination>
        </Container>
      );
  };