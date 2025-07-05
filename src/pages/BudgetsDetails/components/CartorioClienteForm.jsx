import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import { patchBudget } from '../../../services/api';

const CartorioClienteForm = ({ isOpen, toggle, translationDocuments, setAlert, fetchAndSetItem }) => {
    const [finalizacao, setFinalizacao] = useState(translationDocuments[0].finalizacao ? translationDocuments[0].finalizacao : '');
    const [dataEnvio, setDataEnvio] = useState(translationDocuments[0].data_envio_cartorio ? translationDocuments[0].data_envio_cartorio : '');

    const handleFinalizacaoChange = (e) => {
        setFinalizacao(e.target.value);
    };

    const handleDataEnvioChange = (e) => {
        setDataEnvio(e.target.value);
    };

    const handleSubmit = async () => {
        const body = {
            documentos: translationDocuments.map(doc => {
                return {
                    documento_id: doc.documento_id,
                    finalizacao,
                    data_envio_cartorio: dataEnvio
                }
            
        }),
            status: "FINALIZADO"
        }

        console.log(body);

       const data = await patchBudget(translationDocuments[0].budget, body);
       if (!data) {
           setAlert({ type: 'danger', message: 'Erro ao atualizar documentos!' });
           setTimeout(() => {
               setAlert(null);
           }, 3000);
           return;
       }
         setAlert({ type: 'success', message: 'Documentos atualizados com sucesso!' });
            setTimeout(() => {
                setAlert(null);
            }, 3000);
            fetchAndSetItem();
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Formulário de Finalização</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup row>
                        <Label for="finalizacao" sm={3}>Finalização</Label>
                        <Col sm={9}>
                            <FormGroup check>
                                <Label check>
                                    <Input 
                                        type="radio" 
                                        name="finalizacao" 
                                        value="Cartório" 
                                        checked={finalizacao === 'Cartório'} 
                                        onChange={handleFinalizacaoChange} 
                                    />{' '}
                                    Cartório
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input 
                                        type="radio" 
                                        name="finalizacao" 
                                        value="Cliente" 
                                        checked={finalizacao === 'Cliente'} 
                                        onChange={handleFinalizacaoChange} 
                                    />{' '}
                                    Cliente
                                </Label>
                            </FormGroup>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="dataEnvio" sm={3}>Data de Envio</Label>
                        <Col sm={9}>
                            <Input 
                                type="date" 
                                name="dataEnvio" 
                                id="dataEnvio" 
                                value={dataEnvio} 
                                onChange={handleDataEnvioChange} 
                            />
                        </Col>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!finalizacao || !dataEnvio}
                    >Salvar</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancelar</Button>
            </ModalFooter>
        </Modal>
    );
};

export default CartorioClienteForm;