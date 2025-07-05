import React, { useState, useEffect } from 'react';
import {
  Row, Col, Alert, Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import './css/home.css';
import RegistrationMenu from './components/RegistrationMenu/RegistrationMenu';
import InfoUser from './components/InfoUser/InfoUser';
import ServicesList from './components/ServicesList/ServicesList';
import HomeFilter from './components/HomeFilter/HomeFilter';
import { fetchServicesByParams } from '../../services/api';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import HomeClient from './HomeClient';

function Home() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [services, setServices] = useState({ count: 0, results: [] });
  const [alert, setAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { userType } = useAuth();
  const servicesPerPage = 200;

  useEffect(() => {
    const fetchAndSetServices = async () => {
      let params = { statusServico: 'Serviço Aberto' };
      if (userType === 'comercial') {
        params.apenasMeusServicos = true;
      }
      const data = await fetchServicesByParams(params);
      setServices(data.data);
    };

    fetchAndSetServices();
  }, [userType]);

  const handlePageChange = async (pageNumber) => {
    if (pageNumber === currentPage) return;
    setCurrentPage(pageNumber);
    const data = await fetchServicesByParams({ pageNumber });
    if (data) {
      setServices(data.data);
    }
  };

  const totalPages = Math.ceil(services.count / servicesPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (user.user_type === 'cliente') {
    return <HomeClient />;
  }

  return (
    <div className="home">
      <Row className="mt-2" style={{ padding: "0 5%" }}>
        <Col sm="6" className="mt-2">
          <Row className="home-row">
            <Col sm="6" className="mt-2">
              <InfoUser
                username={user.user}
                email={user.email}
                user_type={user.user_type}
                name={`${user.first_name} ${user.last_name}`}
              />
            </Col>
            <Col sm="6" className="mt-2">
              <RegistrationMenu setAlert={setAlert} />
            </Col>
          </Row>
        </Col>

        <Col sm="5" style={{ marginLeft: "10px" }} className="mt-2">
          <HomeFilter
            setAlert={setAlert}
            setServices={setServices}
            fetchAndSetServices={() => fetchServicesByParams().then(res => setServices(res.data))}
          />
        </Col>
      </Row>

      <Row className="mt-2">
        <Col sm="12" className="mt-2">
          {services.results.length > 0 && <ServicesList services={services} />}
        </Col>

        {services.results.length > 0 && (
          <Col sm="12" className="mt-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination>
              {pageNumbers.map((number) => (
                <PaginationItem key={number} active={number === currentPage}>
                  <PaginationLink onClick={() => handlePageChange(number)}>
                    {number}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </Pagination>
          </Col>
        )}
      </Row>

      {alert && (
        <Col style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          <Alert color={alert.type}>
            {alert.message}{' '}
            {alert.type === "danger" ? <FaTimes /> : <FaCheck />}
          </Alert>
        </Col>
      )}
    </div>
  );
}

export default Home;
