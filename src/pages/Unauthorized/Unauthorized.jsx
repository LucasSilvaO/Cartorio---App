import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const Unauthorized = () => {
    return (
        <Container className="text-center mt-5">
            <Row>
                <Col>
                    <FaExclamationTriangle size="5em" color="red" />
                    <h1 className="mt-3">Não Autorizado</h1>
                    <p>Voce não tem permissão para acessar esta página.</p>
                    <Button color="primary" href="/home">Voltar para a Home</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Unauthorized;