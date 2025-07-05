import React, { useState, useEffect } from 'react';
import { fetchServicesByClient } from '../../services/api';
import ServicesList from './components/ServicesList/ServicesList';
import { PaginationComponent } from '../../components/Pagination/Pagination';
import InfoUser from './components/InfoUser/InfoUser';
import { Col, Row } from 'reactstrap';
import HomeFilter from './components/HomeFilter/HomeFilter';

function HomeClient() {
    const user  = JSON.parse(sessionStorage.getItem('user'));
    const [services, setServices] = useState({
      count: 0,
      results: []
    });
    const [alert, setAlert] = useState(null);

    const fetchAndSetServices = async () => {
      const data = await fetchServicesByClient(user.cliente.cliente_id);
      if(data.status === 200) {
        return setServices(data.data);
      }
      setAlert({ type: 'danger', message: 'Erro ao buscar serviços!' });
    }

    useEffect(() => {
      fetchAndSetServices();
    }, []);

    return (
        <div>
            <Row className="home-row" style={{padding: "0 5%"}}>
              <Col sm="6">
                <InfoUser username={user.user} email={user.email} user_type={user.user_type} name={`${user.first_name} ${user.last_name}`}/>
              </Col>
              <Col sm="5" style={{marginLeft: "10px"}}>
                <HomeFilter setAlert={setAlert} setServices={setServices} fetchAndSetServices={fetchAndSetServices} isClient={true}/>
            </Col>
            </Row>
            <Row className="home-row" style={{padding: "0 5%"}}>
                <h1>Meus Serviços</h1>
                <ServicesList services={services} />
                <PaginationComponent items={services} setItems={setServices} />
            </Row>
        </div>
    )
}

export default HomeClient;

