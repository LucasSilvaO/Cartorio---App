import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Col, Alert } from 'reactstrap';
import { fetchTranslators, patchBudget } from '../../../services/api';
import { updateDocumentsBody} from '../../Budgets/utils/utilsBudget';
import { capitalizeFirstLetter } from '../../../utils/stringFunctions';

const TranslationStepsFormModal = ({ isOpen, toggle, translationDocuments, setAlert, fetchAndSetItem }) => {
    console.log(translationDocuments);
    const [translators, setTranslators] = useState([]);
    const [selectedTradutor, setSelectedTradutor] = useState(translationDocuments[0].tradutor && translationDocuments[0].tradutor.tradutor_id);
    const [modalidade, setModalidade] = useState(translationDocuments[0].modalidade && capitalizeFirstLetter(translationDocuments[0].modalidade));
    const [quantidadeDocumentos, setQuantidadeDocumentos] = useState('');
    const [dataEntrada, setDataEntrada] = useState(translationDocuments[0].data_entrada_tradutor);
    const [prazoTipo, setPrazoTipo] = useState('');
    const [prazoData, setPrazoData] = useState(translationDocuments[0].prazo);
    const [prazoDias, setPrazoDias] = useState('');
    const [dataDevolucao, setDataDevolucao] = useState(translationDocuments[0].data_devolucao);

    const fetchAndSetTranlators = async () => {
        const data = await fetchTranslators();
        setTranslators(data.results);
    }
    const updateDocuments = async () => {
        const body = updateDocumentsBody({translationDocuments, selectedTradutor, modalidade, dataEntrada, prazoTipo, prazoData, prazoDias, dataDevolucao});
        const data = await patchBudget(translationDocuments[0].budget ,body);
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
    }
    useEffect(() => {
        fetchAndSetTranlators();
    }, []);

    const handlePrazoTipoChange = (e) => {
        setPrazoTipo(e.target.value);
        setPrazoData('');
        setPrazoDias('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para atualizar o status
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Atualizar Status</ModalHeader>
            <Form onSubmit={handleSubmit}>
                <ModalBody>
                    <FormGroup>
                        <Label for="tradutorSelect">Tradutor *</Label>
                        <Input type="select" id="tradutorSelect" value={selectedTradutor} onChange={(e) => setSelectedTradutor(e.target.value)}>
                            <option value="">Selecione um tradutor</option>
                            {translators.map(tradutor => (
                                <option key={tradutor.id} value={tradutor.tradutor_id}>{tradutor.nome}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="modalidade">Modalidade *</Label>
                        <Input type="select" id="modalidade" value={modalidade} onChange={(e) => setModalidade(e.target.value)}>
                            <option value="">Selecione a modalidade</option>
                            <option value="Normal">Normal</option>
                            <option value="Expresso">Expresso</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="quantidadeDocumentos">Quantidade de Documentos</Label>
                        <Input type="number" id="quantidadeDocumentos" value={translationDocuments.length}  readOnly/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="dataEntrada">Data de Entrada do Tradutor *</Label>
                        <Input type="date" id="dataEntrada" value={dataEntrada} onChange={(e) => setDataEntrada(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Prazo para Serviço</Label>
                        { translationDocuments[0].prazo ?  (
                            <Input type="date" value={translationDocuments[0].prazo} disabled/>
                        ) : (
                            <div>
                                <div>
                            <FormGroup check inline>
                                <Label check>
                                    <Input type="radio" name="prazoTipo" value="data" checked={prazoTipo === 'data'} onChange={handlePrazoTipoChange} />{' '}
                                    Colocar Data
                                </Label>
                            </FormGroup>
                            <FormGroup check inline>
                                <Label check>
                                    <Input type="radio" name="prazoTipo" value="dias" checked={prazoTipo === 'dias'} onChange={handlePrazoTipoChange} />{' '}
                                    Colocar Dias
                                </Label>
                            </FormGroup>
                        </div>
                        {prazoTipo === 'data' && (
                            <Input type="date" value={prazoData} onChange={(e) => setPrazoData(e.target.value)} />
                        )}
                        {prazoTipo === 'dias' && (
                            <Input type="number" value={prazoDias} onChange={(e) => setPrazoDias(e.target.value)} />
                        )}
                            </div>
                        )}
                        
                    </FormGroup>
                    <FormGroup>
                        <Label for="dataDevolucao">Data de Devolução</Label>
                        <Input type="date" id="dataDevolucao" value={dataDevolucao} onChange={(e) => setDataDevolucao(e.target.value)} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" disabled={
                        !selectedTradutor || !modalidade || !dataEntrada || !prazoTipo || (!prazoData && !prazoDias)
                    }
                    onClick={updateDocuments}
                    >Atualizar Status</Button>
                    <Button color="secondary" onClick={toggle}>Cancelar</Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

export default TranslationStepsFormModal;