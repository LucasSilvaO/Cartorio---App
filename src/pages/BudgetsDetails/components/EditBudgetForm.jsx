import React, { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Col
} from 'reactstrap';
import { fetchClients, patchBudget} from '../../../services/api';

const EditBudgetForm = ({ isOpen, toggle, budget, setAlert, fetchAndSetItem}) => {
    const [formData, setFormData] = useState({
        familyName: budget.familia.nome_da_familia,
        serviceOrder: budget.numero_ca,
        link: budget.cliente,
        status: budget.status
    });
    const [clients, setClients] = useState({
        count: 0,
        results: []
    });

    const fetchAndSetClients = async () => {
        const data = await fetchClients();
        setClients(data);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            familia: {
                nome_da_familia: formData.familyName
            },
            numero_ca: formData.serviceOrder,
            cliente: formData.link.cliente_id,
            status: formData.status

        };
        const data = await patchBudget(budget.budget_id, body);
        if (!data) {
            setAlert({ type: 'danger', message: `Erro ao atualizar ${budget.numero_ca ? "Serviço" : "Orçamento"}!` });
            setTimeout(() => {
                setAlert(null);
            }, 3000);
            return;
        }
        setAlert({ type: 'success', message: 'Orçamento atualizado com sucesso!' });
        setTimeout(() => {
            setAlert(null);
        }, 3000);
        toggle();
        fetchAndSetItem();

    };

    useEffect(() => {
        fetchAndSetClients();
    }, []);

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Editar {budget.numero_ca ? "Serviço" : "Orçamento"}</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="familyName">Nome da Família</Label>
                        <Input
                            type="text"
                            name="familyName"
                            id="familyName"
                            value={formData.familyName}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="serviceOrder">Ordem de Serviço</Label>
                        <Input
                            type="text"
                            name="serviceOrder"
                            id="serviceOrder"
                            value={formData.serviceOrder}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="status">Status</Label>
                        <Input
                            type="select"
                            name="status"
                            id="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >   
                            <option value="EM ANDAMENTO">Em Andamento</option>
                            <option value="PENDENTE">Pendente</option>
                            <option value="CANCELADO">Cancelado</option>
                            <option value="FINALIZADO">Finalizado</option>
                            
                        </Input>
                    </FormGroup>
                    {/* <p>Tipo do {budget.numero_ca ? "Serviço": "Orçamento"}</p>
                    <FormGroup>
                        <Input
                            type="checkbox"
                            name="apostilamento"
                            id="apostilamento"
                            value={formData.serviceType}
                            onChange={handleChange}
                            required
                        />
                        <Label for="serviceType">Apostilamento</Label>


                    </FormGroup> */}
                    <FormGroup >
                        <Label for="clientName" sm={10}>Vinculo</Label>
                        <Col sm={10}>
                        <Input
                            type="select"
                            id="client"
                            value={JSON.stringify(formData.link)}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    link: JSON.parse(e.target.value)
                                })
                            }}
                        >
                            {clients.results.map((client, index) => (
                                <option key={index} value={JSON.stringify(client)}>{client.nome}</option>
                            ))}
                        </Input>
  
                    </Col>
                    </FormGroup>
                    <Button color="primary" type="submit">Salvar</Button>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Cancelar</Button>
            </ModalFooter>
        </Modal>
    );
};

export default EditBudgetForm;