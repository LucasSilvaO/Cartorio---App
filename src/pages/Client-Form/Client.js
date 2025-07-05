import React from 'react';
import './css/client.css';
import ListClients from './components/ListClients';
import { fetchClients, fetchWithUrl} from '../../services/api';
import { useEffect } from 'react';
import { Col, Container, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './css/client.css';
import ClientsFilter from './components/ClientsFilter';
import ClientForm from './components/ClientForm';

function Client() {
    const [clients, setClients] = React.useState({
      count: 0,
      results: null
    });
    const [alert, setAlert] = React.useState(null);
    const [modal, setModal] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const clientsPerPage = 200;
    const toggle = () => setModal(!modal);

    const fetchAndSetClients = async () => {
      const data = await fetchClients();
      setClients(data);
    }
    useEffect(() => {
      fetchAndSetClients();
    }, []);

    const handlePageChange = async (pageNumber) => {
      if(pageNumber === currentPage) {
          return;
      }
      
      setCurrentPage(pageNumber);
      const data =  await fetchClients(pageNumber);
      if (data) {
          setClients(data);
      }
  };


  const renderPagination = () => {
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(clients.count / clientsPerPage); i++) {
          pageNumbers.push(i);
      }

      return (
          <Pagination>
              {pageNumbers.map(number => (
                  <PaginationItem key={number} active={number === currentPage}>
                      <PaginationLink onClick={() => handlePageChange(number)}>
                          {number}
                      </PaginationLink>
                  </PaginationItem>
              ))}
          </Pagination>
      );
  };

    return (
        <div style={{width: "100%"}}>
          <Container>
            <ClientsFilter setClients={setClients} toggle={toggle}/>
            <ListClients clients={clients.results ? clients.results : []} />
            {clients.results && <Col sm="12" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '10px'
            }}>{renderPagination()}</Col>}
            <ClientForm modal={modal} toggle={toggle} setClients={setClients}/>
          </Container>    
        </div>
    );
  }
  
  export default Client;