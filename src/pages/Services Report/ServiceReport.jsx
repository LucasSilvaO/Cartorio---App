import React, { useEffect, useState } from "react";
import { fetchServices } from "../../services/api";
import { PaginationComponent } from "../../components/Pagination/Pagination";
import { Alert, Col, Container, Row } from "reactstrap";
import ServicesList from "../Home/components/ServicesList/ServicesList";
import HomeFilter from "../Home/components/HomeFilter/HomeFilter";
import { FaCheck, FaTimes } from "react-icons/fa";

const ServiceReport = () => {
    const [services, setServices] = useState({
      count: 0,
      results: []
    });
    const [alert, setAlert] = useState(null);
    const fetchAndSetServices = async () => {
      const data = await fetchServices()
      setServices(data);
    }

    const countDocuments = () => {
        const totalDocuments = services.results.reduce((acc, service) => {
            return acc + service.documentos.reduce((docAcc, doc) => {
                return docAcc + (doc.quantidade || 0);
            }, 0);
        }, 0);
        return totalDocuments;
    };


    useEffect(() => {
        fetchAndSetServices();
    }, []);
    return (
        <Row className="mt-2" style={{padding: "0 10%"}}>
            <Col sm="4">
                <HomeFilter setAlert={setAlert} setServices={setServices} fetchAndSetServices={fetchAndSetServices} />
                <Container style={{border: '1px solid #ccc', padding: '10px', marginTop: '10px', textAlign: 'center'}}>
                    <h3>Quantidade de Documentos</h3>
                    <h3>{countDocuments()}</h3>
                </Container>
            </Col>
            <Col sm="8">
                <ServicesList services={services} setAlert={setAlert} fetchAndSetServices={fetchAndSetServices} />
                <PaginationComponent items={services} setItems={setServices} />
            </Col>
            {alert && (
                <Col md={3} style={{position: 'fixed', bottom: '10px', right: '10px'}}>
                    <Alert color={alert.type}>
                      {alert.message}{' '}
                      {alert.type === "danger" ? (
                        <FaTimes/>
                      ): 
                      <FaCheck/>
                      }
                    </Alert>
                </Col>
            )}
        </Row>
    );
}

export default ServiceReport;