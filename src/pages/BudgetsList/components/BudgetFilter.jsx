import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Container } from 'reactstrap';
import { fetchClients } from '../../../services/api';
import { fetchBudgetsByParams } from '../../../services/api';

const BudgetFilter = ({ setBudgets, setAlert, fetchAndSetBudgets }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [clientName, setClientName] = useState('');
    const [archived, setArchived] = useState(false);
    const [clients, setClients] = useState({
        count: 0,
        results: []
    });
    const [searchTermClient, setSearchTermClient] = useState('');

    const filteredClients = clients.results.filter(client =>
        client.nome.toLowerCase().includes(searchTermClient.toLowerCase())
    );

    const fetchAndSetClients = async () => {
        const data = await fetchClients();
        setClients(data);
    }

    const handleFilter = async () => {
        if (startDate === '' || endDate === '') {
            setAlert({ message: 'Por favor, preencha as datas de início e término', type: 'danger' });
            setTimeout(() => {
                setAlert(null);
            }, 3000);
            return;
        }
        if (startDate > endDate) {
            setAlert({ message: 'A data de início não pode ser maior que a data de término', type: 'danger' });
            setTimeout(() => {
                setAlert(null);
            }, 3000);
            return;
        }
        const data = await fetchBudgetsByParams(startDate, endDate, clientName, archived);
        if (data.length === 0) {
            setAlert({ message: 'Nenhum orçamento encontrado', color: 'danger' });
            setTimeout(() => {
                setAlert(null);
            }, 3000);
        }
        setBudgets(data);
    };

    const handleClear = () => {
        setStartDate('');
        setEndDate('');
        setClientName('');
        setArchived(false);
        fetchAndSetBudgets();
    };

    useEffect(() => {
        fetchAndSetClients();
    }, [])

    return (
        <Container style={{backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '5px', marginBottom: '20px'}}>
        <Form>
            <FormGroup >
                <Label for="startDate" sm={10}>Data de Início</Label>
                <Col sm={10}>
                    <Input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Col>
            </FormGroup>
            <FormGroup>
                <Label for="endDate" sm={10}>Data de Término</Label>
                <Col sm={10}>
                    <Input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Col>
            </FormGroup>
            <FormGroup >
                <Label for="clientName" sm={10}>Nome do Cliente</Label>
                <Col sm={10}>
                <Input
                    type="text"
                    id="clientSearch"
                    placeholder="Digite o nome do cliente"
                    value={searchTermClient}
                    onChange={(e) => {
                        setSearchTermClient(e.target.value)
                        setClientName(e.target.value)
                    }}
                    list="clientOptions"
                />
                <datalist id="clientOptions">
                    {filteredClients.map((client, index) => (
                        <option key={index} value={client.nome} />
                    ))}
                </datalist>
            </Col>
            </FormGroup>
            <FormGroup>          
                <Input
                    type="checkbox"
                    name="archived"
                    id="archived"
                    checked={archived}
                    onChange={(e) => setArchived(e.target.checked)}
                />
                <Label for="archived">Orçamentos Arquivados</Label>
            </FormGroup>
            <FormGroup row>
                <Col sm={{ size: 10, offset: 2 }}>
                    <Button color="primary" onClick={handleFilter}>Filtrar</Button>{' '}
                    <Button color="secondary" onClick={handleClear}>Limpar Filtros</Button>
                </Col>
            </FormGroup>
        </Form>
        </Container>
    );
};

export default BudgetFilter;