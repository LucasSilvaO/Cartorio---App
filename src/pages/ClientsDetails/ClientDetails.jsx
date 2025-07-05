import React from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'reactstrap';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchClientById, fetchServicesByParams } from '../../services/api';
import MenuClientDetails from './components/MenuClientDetails';
import ServicesList from '../Home/components/ServicesList/ServicesList';
import { PaginationComponent } from '../../components/Pagination/Pagination';

const ClientDetails = () => {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [clientServices, setClientServices] = useState({
        count: 0,
        results: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterOptions, setFilterOptions] = useState({
        familia: '',
        os: '',
        ordenacao: ''
    })
    const [alert, setAlert] = useState(null);

    const fetchAndSetClientServices = async () => {
        const data = await fetchServicesByParams({ clientId: id });
        console.log(data);
        if (data.status === 200) {
            setClientServices(data.data);
        }
        else {
            setAlert({ type: 'danger', message: 'Erro ao buscar serviços!' });
        }

    }

    const fetchAndSetClient = async () => {
        const data = await fetchClientById(id);
        console.log(data);
        setClient(data);
        setLoading(false);
    }
    useEffect(() => {
        fetchAndSetClient();
        fetchAndSetClientServices();
    }, []);

    if (loading) {
        return (
            <Container>
                <Row>
                    <Col className="text-center">
                        <Spinner color="primary" />
                    </Col>
                </Row>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Row>
                    <Col>
                        <Alert color="danger">
                            Error: {error.message}
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container>
            {client ? (
                <Row>
                    <Col sm="6">
                        <MenuClientDetails client={client} setClient={setClient} fetchAndSetClient={fetchAndSetClient}/>
                    </Col>
                    <Col sm="6">
                        <h1>{client.nome}</h1>
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <th scope="row">Responsável</th>
                                    <td>{client.nome_do_representante}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Email</th>
                                    <td>{client.email}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Telefone</th>
                                    <td>{client.telefone}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Endereço</th>
                                    <td>{client.endereco}</td>
                                </tr>
                                <tr>
                                    <th scope="row">CNPJ/CPF</th>
                                    <td>{client.cpf_cnpj}</td>
                                </tr>
                                <tr>
                                    <th scope="row">CEP</th>
                                    <td>{client.cep}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Tipo de Cliente</th>
                                    <td>{client.tipo_do_cliente}</td>
                                </tr>
                                {/* Add more client details as needed */}
                            </tbody>
                        </table>
                    </Col>
                    <Col sm="12">
                        <Row className="mb-3">
                            <Col sm="4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por família"
                                    onChange={(e) => {
                                        setFilterOptions({ ...filterOptions, familia: e.target.value });
                                    }}
                                />
                            </Col>
                            <Col sm="4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por O.S"
                                    onChange={(e) => {
                                       setFilterOptions({ ...filterOptions, os: e.target.value });
                                    }}
                                />
                            </Col>
                            <Col sm="4">
                                <select
                                    className="form-control"
                                    onChange={(e) => {
                                        setFilterOptions({ ...filterOptions, ordenacao: e.target.value });
                                    }}
                                >
                                    <option value="">Ordenar por</option>
                                    <option value="name">Nome</option>
                                    <option value="date">Data</option>
                                </select>
                            </Col>
                            <Col sm="4" style={{ marginTop: '10px' }}>
                                <Button
                                    disabled={(filterOptions.familia === '' || filterOptions.os === '') && filterOptions.ordenacao === ''}
                                    color="primary"
                                    onClick={ async ()  => {
                                        const params = {
                                            clientId: id,
                                            familia: filterOptions.familia,
                                            numeroCA: filterOptions.os,
                                        };
                                        const filteredServices = await fetchServicesByParams(params);
                                        if (filteredServices.results.length === 0) {
                                            setAlert({ type: 'danger', message: 'Nenhum serviço encontrado!' });
                                            setClientServices({
                                                count: 0,
                                                results: null
                                            });
                                            setTimeout(() => {
                                                setAlert(null);
                                            }, 3000);
                                            return;
                                        }

                                        if(filterOptions.ordenacao === 'name') {
                                            filteredServices.results.sort((a, b) => a.familia.nome_da_familia.localeCompare(b.familia.nome_da_familia));
                                        } else if(filterOptions.ordenacao === 'date') {
                                            filteredServices.results.sort((a, b) => new Date(a.data_de_criacao) - new Date(b.data_de_criacao));
                                        }
                                        setAlert({ type: 'success', message: `Filtro Aplicado, encontrado(s) ${filteredServices.results.length} serviço(s)!` });
                                        setTimeout(() => {
                                            setAlert(null);
                                        }, 3000);
                                        setClientServices(filteredServices);

                                        // Handle filter
                                    }}
                                >Filtrar</Button>
                            </Col>
                        </Row>
                        <ServicesList services={clientServices.results ? clientServices : []} />
                        <PaginationComponent items={clientServices} setItems={setClientServices} fetchItems={fetchAndSetClientServices} />
                    </Col>
                    {alert && (
                        <Col md={3} style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
                            <Alert color={alert.type}>
                                {alert.message}
                            </Alert>
                        </Col>
                    )}
                </Row>
            ) : (
                <Row>
                    <Col>
                        <Alert color="warning">
                            No client data found
                        </Alert>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default ClientDetails;