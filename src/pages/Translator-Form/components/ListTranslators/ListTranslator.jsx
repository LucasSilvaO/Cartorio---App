import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { API_BACK_URL } from '../../../../config/config';

const ListTranslator = ({translators}) => {

    return (
        <Container style={{ backgroundColor: "#F4F4F4" }}>
            <Row>
                <Col>
                    <Container style={{color:"white", borderRadius: "10px", backgroundColor: "#95be1f", padding: "20px", alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h1>Tradutores</h1>
                    </Container>
                    <Row>
                        {translators.map((translator) => (
                            <Col sm="4" key={translator.id} style={{ padding: '10px' }}>
                                <ListGroupItem style={{ backgroundColor: "white", borderRadius: "10px", padding: "20px" }}>
                                    <p>Nome: {translator.nome}</p>
                                    <p>Email: {translator.email}</p>
                                    <p>Prazo em dias: {translator.prazo_em_dias}</p>
                                </ListGroupItem>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default ListTranslator;