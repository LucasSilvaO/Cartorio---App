import React, { useEffect } from 'react';
import { Table, Button, Row, Col, Alert, Spinner, Container, Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { fetchBudgets, fetchBudgetsByParams, patchBudget } from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import BudgetFilter from './components/BudgetFilter';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BudgetsList = () => {
    const [budgets, setBudgets] = React.useState({
        count: 0,
        results: null
    });
    const [budgetsToEdit, setBudgetsToEdit] = React.useState({
        count: 0,
        results: null
    });
    const [currentPage, setCurrentPage] = React.useState(1);
    const [loadingButtons, setLoadingButtons] = React.useState({}); // Estado para loading dos botões
    const budgetsPerPage = 200;

    const [alert, setAlert] = React.useState(null);

    const fetchAndSetBudgets = async () => {
        const data = await fetchBudgets();
        console.log(data);
        setBudgets(data);
        setBudgetsToEdit(data);
    };

    const archiveBudget = async (id) => {
        const data = await patchBudget(id, { arquivado: true });
        if (!data) {
            setAlert({ type: 'danger', message: 'Erro ao arquivar orçamento!' });
            setTimeout(() => {
                setAlert(null);
            }, 3000);
            return;
        }
        setAlert({ type: 'success', message: 'Orçamento arquivado com sucesso!' });
        setTimeout(() => {
            setAlert(null);
        }, 3000);
    };

    const handlePageChange = async (pageNumber) => {
        setCurrentPage(pageNumber);
        const data = await fetchBudgetsByParams(null, null, null, null, pageNumber);
        if (data) {
            setBudgets(data);
        }
    };


    

    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(budgets.count / budgetsPerPage); i++) {
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

    useEffect(() => {
        fetchAndSetBudgets();
    }, []);

    if (!budgets.results) {
        return <Container style={{ display: "flex", justifyContent: "center" }}><Spinner /></Container>;
    }

    return (
        <Container fluid>
            <Row>
                <Col md={3} className="mb-3">
                    <BudgetFilter setAlert={setAlert} setBudgets={setBudgets} fetchAndSetBudgets={fetchAndSetBudgets} />
                </Col>
                <Col md={9} style={{ fontSize: '0.8rem' }}>
                    <Table striped responsive>
                        <thead>
                            <tr>
                                <th>Data de Entrada</th>
                                <th>Assessoria</th>
                                <th>Nome do Cliente</th>
                                <th>Nº Orçamento</th>
                                <th>Data de Vencimento</th>
                                <th>Descrição</th>
                                <th>Quantidade</th>
                                <th>Valor Total</th>
                                <th>Arquivar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets.results.map((budget, index) => (
                                <tr key={index}>
                                    <td>{formatDate(budget.data_criacao)}</td>
                                    <td>{budget.cliente.nome}</td>
                                    <td>{budget.familia.nome_da_familia}</td>
                                    <td>
                                        <Link to={`/budgets/${budget.budget_id}`}>{budget.budget_id}</Link>
                                    </td>
                                    <td>{formatDate(budget.prazo)}</td>
                                    <td>{budget.documentos.map((doc) => doc.tipo_documento).join(', ')}</td>
                                    <td>{budget.documentos.length}</td>
                                    <td>{budget.valor}</td>
                                    <td>
                                        <Button color="primary" onClick={() => {
                                            archiveBudget(budget.budget_id)
                                            fetchAndSetBudgets();
                                        }}>Arquivar</Button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="6">Total de orçamentos: {budgets.count}</td>
                                <td colSpan="6">Valor total: R$ {budgets.results.reduce((acc, budget) => acc + +budget.valor, 0).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </Table>
                    {renderPagination()}
                </Col>
                {alert  && (
                    <Col md={2} style={{ position: 'fixed', bottom: '10px', right: '10px'}}>
                        <Alert color={alert.type}>
                            {alert.message}{' '}
                            {alert.type === "danger" ? (
                                <FaTimes />
                            ) :
                                <FaCheck />
                            }
                        </Alert>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default BudgetsList;