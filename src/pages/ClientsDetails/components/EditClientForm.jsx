
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { editClient } from '../../../services/api';

const EditClientForm = ({client, modal, toggle, setClient}) => {
    const [clienteForm, setClienteForm] = useState(client);
    const [alert, setAlert] = useState(null);

    const handleChange = (e) => {
        setClienteForm({
            ...clienteForm,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Editar Cliente</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="nome">Nome da Assessoria<span style={{color:"red"}}>*</span></Label>
                            <Input type="text" name="nome" id="nome" value={clienteForm.nome} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="nome_do_representante">Nome do Responsável</Label>
                            <Input type="text" name="nome_do_representante" id="nome_do_representante" value={clienteForm.nome_do_representante} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="cpf_cnpj">CNPJ/CPF</Label>
                            <Input type="text" name="cpf_cnpj" id="cpf_cnpj" value={clienteForm.cpf_cnpj} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email" placeholder='cliente@cliente.com' value={clienteForm.email} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="telefone">Telefone</Label>
                            <Input type="text"  placeholder="Digite o telefone no formato (XX) XXXXX-XXXX" name="telefone" id="telefone" value={clienteForm.telefone} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="endereco">Endereço</Label>
                            <Input type="text" name="endereco" id="endereco" value={clienteForm.endereco} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="cep">CEP</Label>
                            <Input type="text" name="cep" id="cep" value={clienteForm.cep} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup style={{display:"flex", flexDirection:"column"}}>
                            <Label for="tipo_do_cliente">Tipo de Cliente<span style={{color:"red"}}>*</span></Label>
                            <Label >
                              <Input 
                                type="radio"
                                name='tipo_do_cliente'
                                value="MENSALISTA"
                                checked={clienteForm.tipo_do_cliente === "MENSALISTA"}
                                onChange={handleChange}
                                />
                                {' '}Cliente Mensalista
                            </Label>
                            <Label>
                              <Input
                                type="radio"
                                name='tipo_do_cliente'
                                value="CLIENTE A VISTA"
                                checked={clienteForm.tipo_do_cliente === "CLIENTE A VISTA"}
                                onChange={handleChange}
                                />    
                                {' '}Cliente a Vista
                            </Label>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        disabled={clienteForm.nome === '' || clienteForm.tipo_do_cliente === ''}
                        color="primary"
                        onClick={ async () => {
                        const data = await editClient(clienteForm);
                        if (data) {
                            setClient(data);
                            toggle();
                            setAlert({
                                type: 'success',
                                message: 'Cliente editado com sucesso!'
                            });
                            setTimeout(() => {
                                setAlert(null);   
                            }, 5000);
                        } else {
                            setAlert({
                                type: 'error',
                                message: 'Erro ao editar cliente!'
                            });
                            setTimeout(() => {
                                setAlert(null);
                            }, 5000);
                        }
                    }}>Salvar</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancelar</Button>
                </ModalFooter>
            </Modal>
            {alert && <Alert color={alert.type} style={{position: 'fixed', bottom: '10px', right: '10px'}}>{alert.message}</Alert>} 
        </div>
    );
};

export default EditClientForm;