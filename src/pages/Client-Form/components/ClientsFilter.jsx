import React, { useState } from 'react';
import { Button, Input, Label, FormGroup, Form, Container } from 'reactstrap';
import { fetchClientByParams } from '../../../services/api';

const ClientsFilter = ({ setClients, toggle }) => {
    const [nomeAssesoria, setNomeAssesoria] = useState(null);
    const [tipoAssesoria, setTipoAssesoria] = useState(null);

    const handleFilter = async  () => {
        const data = await fetchClientByParams(nomeAssesoria, tipoAssesoria);
        setClients(data);
    };

    return (
        <Container style={{marginTop: "20px", backgroundColor: "#BF202D", color: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px"}}>
        <Form>
            <FormGroup>
                <Label for="nomeAssesoria">Nome da Assesoria:</Label>
                <Input
                    type="text"
                    id="nomeAssesoria"
                    value={nomeAssesoria}
                    onChange={(e) => setNomeAssesoria(e.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for="tipoAssesoria">Tipo de Assesoria:</Label>
                <Input
                    type="select"
                    id="tipoAssesoria"
                    value={tipoAssesoria}
                    onChange={(e) => setTipoAssesoria(e.target.value)}
                >
                    <option value="">Selecione</option>
                    <option value="CLIENTE A VISTA">A vista</option>
                    <option value="MENSALISTA">Mensalista</option>
                </Input>
            </FormGroup>
                
        </Form>
        <Container style={{display: "flex", justifyContent: "flex-start"}}>
            <Button color="success" onClick={handleFilter}>Filtrar</Button>
            <div style={{margin:"10px"}}/>   
            <Button color="primary" onClick={toggle}>Cadastrar novo Cliente</Button>
        </Container>   
        </Container>
    );
};

export default ClientsFilter;