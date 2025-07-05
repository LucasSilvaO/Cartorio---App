import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { updateTranslatorSignatureDocumentsBody } from "../../Budgets/utils/utilsBudget"
import { patchBudget } from '../../../services/api';

const TranslatorSignatureForm = ({ isOpen, toggle, translationDocuments, setAlert, fetchAndSetItem }) => {
    const [physicalSignature, setPhysicalSignature] = useState(translationDocuments[0].tipo_de_assinatura === 'Assinatura Física');
    const [digitalSignature, setDigitalSignature] = useState(translationDocuments[0].tipo_de_assinatura === 'Assinatura Digital');
    const [sendDate, setSendDate] = useState(translationDocuments[0].data_envio_tradutor ? translationDocuments[0].data_envio_tradutor : false);
    const [returnDate, setReturnDate] = useState(translationDocuments[0].data_devolucao_tradutor ? translationDocuments[0].data_devolucao_tradutor : false);

    const handleUpdateService = () => {
        // Handle the update service logic here
        const body = updateTranslatorSignatureDocumentsBody({translationDocuments, physicalSignature, digitalSignature, sendDate, returnDate});
        const data = patchBudget(translationDocuments[0].budget, body);
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
            <ModalHeader toggle={toggle}>Atualizar Serviço</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup check>
                        <Label check>
                            <Input 
                                type="checkbox" 
                                checked={physicalSignature} 
                                onChange={(e) => {
                                    setPhysicalSignature(e.target.checked)
                                    if (e.target.checked) {
                                        setDigitalSignature(false)
                                    }
                                }} 
                            />{' '}
                            Assinatura física
                        </Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input 
                                type="checkbox" 
                                checked={digitalSignature} 
                                onChange={(e) => {
                                    setDigitalSignature(e.target.checked)
                                    if (e.target.checked) {
                                        setPhysicalSignature(false)
                                    }
                                }} 
                            />{' '}
                            Assinatura digital
                        </Label>
                    </FormGroup>
                    <FormGroup>
                        <Label for="sendDate">Envio da Tradução</Label>
                        <Input 
                            type="date" 
                            name="sendDate" 
                            id="sendDate" 
                            value={sendDate} 
                            onChange={(e) => setSendDate(e.target.value)} 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="returnDate">Data de Devolução</Label>
                        <Input 
                            type="date" 
                            name="returnDate" 
                            id="returnDate" 
                            value={returnDate} 
                            onChange={(e) => setReturnDate(e.target.value)} 
                        />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    onClick={handleUpdateService}
                    disabled={!(physicalSignature || digitalSignature && sendDate && returnDate)}
                    >Atualizar Serviço</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancelar</Button>
            </ModalFooter>
        </Modal>
    );
};

export default TranslatorSignatureForm;