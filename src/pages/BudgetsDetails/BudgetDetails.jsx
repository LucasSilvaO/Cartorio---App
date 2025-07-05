import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Row, Col, Card, CardBody, CardTitle, CardText, Table, Modal, Alert, Badge, Spinner, ModalBody, ModalHeader } from 'reactstrap';
import { fetchBudgetById, fetchUserById, patchBudget, createComment} from '../../services/api';
import { calculateDaysDifference, formatDate, formatDateTime } from '../../utils/formatDate';
import TranslationStepsFormModal from './components/TranslationStepsForm';
import TranslatorSignatureForm from './components/TranslatorSignatureForm';
import { FaCheck, FaTimes } from 'react-icons/fa';
import CartorioClienteForm from './components/CartorioClienteForm';
import EditBudgetForm from './components/EditBudgetForm';
import { useAuth } from '../../hooks/useAuth';
import { FaPaperclip } from 'react-icons/fa';

const BudgetDetails = () => {
    const { budget_id } = useParams();
    const [budget, setBudget] = useState(null);
    const [userBudget, setUserBudget] = useState(null);
    const [traducaoDocs, setTraducaoDocs] = useState(null);
    const [crcDocs, setCrcDocs] = useState(null);
    const [modals, setModals] = useState({
        etapaTraducao: false,
        assinaturaTraducao: false,
        cartorioCliente: false,
        editBudget: false,
        cancelBudget: false,
        deleteBudget: false
    });
    const [novoComentario, setNovoComentario] = useState('');
    const [alert, setAlert] = useState(null);
    const { hasAccess } = useAuth();

    const toggle = (modal) => {
        setModals({
            ...modals,
            [modal]: !modals[modal]
        });
    }

    const fetchAndSetBudget = async () => {
        const data = await fetchBudgetById(budget_id);
        if(!data.budget_id) {
            setAlert({type: 'danger', message: 'Erro ao buscar orçamento!'});
            setTimeout(() => {
                setAlert(null);
            }, 3000);
            return;
        }
        setTraducaoDocs(data.documentos.filter(doc => doc.tipo_documento === 'TRADUCAO'));
        setCrcDocs(data.documentos.filter(doc => doc.tipo_documento === 'CRC'));
        setBudget(data);
        if(data.usuario) {
            const userBudget = await fetchUserById(data.usuario);
            setUserBudget(userBudget);
        }
        
    }

    useEffect(() => {
        fetchAndSetBudget();
    }, []);

    if (!budget) {
        return (
            <Container style={{display:"flex", justifyContent:"center"}}><Spinner/>            {alert && (
                <Col md={3} style={{position: 'fixed', bottom: '10px', right: '10px'}}>
                    <Alert color={alert.type}>
                      {alert.message}{' '}
                      {alert.type === "danger" ? (
                        <FaTimes/>
                      ): 
                      <FaCheck/>
                      }
                    </Alert>
                </Col>
            )}</Container>
        );
    }

    return (
        <Container>
            <Row
              className="my-4"
              style={{
                backgroundColor: '#00346D',
                padding: '20px',
                borderRadius: '5px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Col>
                <h4>Nome da Família</h4>
                <h1>{budget.familia.nome_da_familia}</h1>
              </Col>
              <Col>
                <h4>Ordem de Serviço</h4>
                <h4>{budget.numero_ca}</h4>
              </Col>
              <Col>
                <h4>Tipo de Serviço</h4>
                <h4>{budget.documentos.map((doc) => doc.tipo_documento).join(', ')}</h4>
              </Col>
              <Col
                className="d-flex justify-content-end"
                style={{ gap: '10px' }}
              >
                <Button color="primary" onClick={
                    () => toggle('editBudget')
                }>Editar</Button>
                {hasAccess(['gerencia', 'admin']) && (
                    <Col style={{display: 'flex', gap: '10px'}}>
                        <Button color="warning" 
                            onClick={() => toggle('cancelBudget')}
                        >Cancelar
                        </Button>
                        
                        <Button color="danger" onClick={
                            () => toggle('deleteBudget')
                        }>Excluir
                        </Button>
                    </Col>
                )}

              </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Controle Fatto</CardTitle>
                            <CardText>
                                <Row>
                                    <Col md={3}>
                                        <strong>Data de Entrada:</strong>
                                        <p>{formatDate(budget.data_criacao)}</p>
                                    </Col>
                                    <Col md={3}>
                                        <strong>Assessoria</strong>
                                        <p>{budget.cliente.nome}</p>
                                    </Col>
                                    <Col md={3}>
                                        <strong>Status</strong>
                                        <p>{budget.status}</p>
                                    </Col>
                                    <Col md={3}>
                                        <strong>Coloborador Fatto</strong>
                                        {userBudget ? (<p>{userBudget.first_name} {userBudget.last_name}</p>) : <p>Não atribuído</p>}                                
                                    </Col>
                                    { budget.comprovante_pagamento !== "" && (
                                    <Col md={3} style={{alignItems: "center", cursor: "pointer"}}>
                                        <a href={budget.comprovante_pagamento} target="_blank" rel="noopener noreferrer" style={{textDecoration: "none", color: "black"}}>
                                            <strong>Comprovante de pagamento{" "}</strong>
                                            <FaPaperclip style={{fontSize: "20px"}}>
                                            </FaPaperclip>
                                        </a>
                                    </Col>
                                    )}
       
                                </Row>
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {!budget.numero_ca && (
                            <Row className="mt-4">
                            <Col>
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">Dados do Orçamento</CardTitle>
                                        <CardText>
                                            <Row>
                                            <Col md={4}>
                                                    <strong>Nº Orçamento</strong>
                                                    <p>{budget.budget_id}</p>
                                                </Col>
                                                <Col md={4}>
                                                    <strong>Data de Vencimento:</strong>
                                                    <p>{formatDate(budget.prazo)}</p>
                                                </Col>
                                                <Col md={4}>
                                                    <strong>Origem do Orçamento:</strong>
                                                    <p>{budget.origem}</p>
                                                </Col>
                                                { hasAccess(['admin', 'gerencia', 'financeiro', 'comercial']) && (
                                                <Col md={4}>
                                                    <strong>Valor Total:</strong>
                                                    <p>R$ {budget.valor}</p>
                                                </Col>
                                                )}

                                                <Col md={4}>
                                                    <strong>Forma de Pagamento:</strong>
                                                    <p>{budget.forma_de_pagamento}</p>
                                                </Col>
                                            </Row>
                                        </CardText>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
            )}

            <Row className="mt-4">
                <Col>
                    <h4>Documentos de Tradução</h4>
                    {traducaoDocs.length > 0 ? (
                        <Container>
                        <Row className="gy-4 gx-4">
                            {/* Coluna Esquerda */}
                            <Col md={8}>
                                {/* Tabela de Documentos */}
                                <Row>
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Tipo</th>
                                                <th>Idioma</th>
                                                <th>Descrição</th>
                                                { hasAccess(['admin', 'gerencia', 'financeiro', 'comercial']) && (
                                                <th>Valor</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {traducaoDocs.map((doc) => (
                                                <tr key={doc.documento_id}>
                                                    <td>{doc.nome}</td>
                                                    <td>{doc.tipo_documento}</td>
                                                    <td>{doc.idioma_da_traducao}</td>
                                                    <td>{doc.descricao}</td>
                                                    { hasAccess(['admin', 'gerencia', 'financeiro', 'comercial']) && (
                                                        <td>R$ {doc.valor}</td>
                                                    )}
                                                    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Row>
                    
                                {/* Etapas de Tradução */}
                                <Row className="mt-4">
                                    <Card>
                                        <CardBody>
                                            <CardTitle tag="h5">Etapas de Tradução</CardTitle>
                                            <CardText>
                                                <Row className="g-3">
                                                    <Col md={2}>
                                                        <strong>Data de Envio:</strong>
                                                        <p>
                                                            {traducaoDocs[0]?.data_entrada_tradutor &&
                                                                formatDate(traducaoDocs[0].data_entrada_tradutor)}
                                                        </p>
                                                    </Col>
                                                    <Col md={2}>
                                                        <strong>Documentos:</strong>
                                                        <p>{traducaoDocs.length}</p>
                                                    </Col>
                                                    <Col md={2}>
                                                        <strong>Modalidade:</strong>
                                                        <p>{traducaoDocs[0].modalidade}</p>
                                                    </Col>
                                                    <Col md={2}>
                                                        <strong>Prazo:</strong>
                                                        <p>
                                                            {traducaoDocs[0].prazo && formatDate(traducaoDocs[0].prazo)}
                                                        </p>
                                                        {budget.status === "FINALIZADO" ? (
                                                            <Badge color="success">Finalizado</Badge>
                                                        ) : traducaoDocs[0].prazo ? ( // Removidas as chaves extras
                                                            <Badge
                                                                color={
                                                                    calculateDaysDifference(
                                                                        new Date(),
                                                                        new Date(traducaoDocs[0].prazo)
                                                                    ) < 0
                                                                        ? "danger"
                                                                        : calculateDaysDifference(
                                                                              new Date(),
                                                                              new Date(traducaoDocs[0].prazo)
                                                                          ) < 3
                                                                        ? "warning"
                                                                        : "success"
                                                                }
                                                            >
                                                                {calculateDaysDifference(
                                                                    new Date(),
                                                                    new Date(traducaoDocs[0].prazo)
                                                                ) < 0
                                                                    ? "Atrasado"
                                                                    : "Restam"}{" "}
                                                                {Math.abs(
                                                                    calculateDaysDifference(
                                                                        new Date(),
                                                                        new Date(traducaoDocs[0].prazo)
                                                                    )
                                                                )}{" "}
                                                                dias
                                                            </Badge>
                                                        ) : null} 
                                                    </Col>
                                                    <Col md={2}>
                                                        <strong>Data de Devolução:</strong>
                                                        <p>
                                                            {traducaoDocs[0]?.data_devolucao &&
                                                                formatDate(traducaoDocs[0].data_devolucao)}
                                                        </p>
                                                    </Col>
                                                    <Col md={2}>
                                                        <strong>Tradutor:</strong>
                                                        <p>{traducaoDocs[0]?.tradutor?.nome}</p>
                                                    </Col>
                                                    <Col md={12} className="text-end">
                                                        <Button
                                                            color="primary"
                                                            onClick={() => toggle("etapaTraducao")}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                </Row>
                    
                                {/* Assinatura da Tradutora */}
                                <Row className="mt-4">
                                    <Card>
                                        <CardBody>
                                            <CardTitle tag="h5">Assinatura da Tradutora</CardTitle>
                                            <CardText>
                                                <Row className="g-3">
                                                    <Col md={4}>
                                                        <strong>Tipo de Assinatura:</strong>
                                                        <p>{traducaoDocs[0]?.tipo_de_assinatura}</p>
                                                    </Col>
                                                    <Col md={4}>
                                                        <strong>Envio para Tradutora:</strong>
                                                        {traducaoDocs[0]?.data_envio_tradutor ? (
                                                            <p>{formatDate(traducaoDocs[0].data_envio_tradutor)}</p>
                                                        ) : (
                                                            <Badge color="warning">Aguardando Envio</Badge>
                                                        )}
                                                    </Col>
                                                    <Col md={4}>
                                                        <strong>Data Devolução da Tradutora:</strong>
                                                        {traducaoDocs[0]?.data_devolucao_tradutor ? (
                                                            <p>{formatDate(traducaoDocs[0].data_devolucao_tradutor)}</p>
                                                        ) : (
                                                            <Badge color="warning">Aguardando Devolução</Badge>
                                                        )}
                                                    </Col>
                                                    <Col md={12} className="text-end">
                                                        <Button
                                                            color="primary"
                                                            onClick={() => toggle("assinaturaTraducao")}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                </Row>
                    
                                {/* Cartório e Cliente */}
                                <Row className="mt-4">
                                    <Card>
                                        <CardBody>
                                            <CardTitle tag="h5">Cartório | Cliente</CardTitle>
                                            <CardText>
                                                <Row className="g-3">
                                                    <Col md={6}>
                                                        <strong>Data de Envio:</strong>
                                                        {traducaoDocs[0]?.data_envio_cartorio ? (
                                                            <p>{formatDate(traducaoDocs[0].data_envio_cartorio)}</p>
                                                        ) : (
                                                            <Badge color="warning">Aguardando Envio</Badge>
                                                        )}
                                                    </Col>
                                                    <Col md={6}>
                                                        <strong>Finalização:</strong>
                                                        {traducaoDocs[0]?.finalizacao ? (
                                                            <p>{traducaoDocs[0].finalizacao}</p>
                                                        ) : (
                                                            <Badge color="warning">Aguardando Finalização</Badge>
                                                        )}
                                                    </Col>
                                                    <Col md={12} className="text-end">
                                                        <Button
                                                            color="primary"
                                                            onClick={() => toggle("cartorioCliente")}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                </Row>
                            </Col>                       
                            {/* Coluna Direita */}
                            <Col md={4} >
                                <Row style={{margin: "20px 0"}}>
                                    <Card>
                                        <CardBody>
                                            <CardTitle tag="h5">Comentários</CardTitle>
                                            {budget.comentarios.map((comentario, index) => (
                                                    <Card key={index} className="mb-2">
                                                        <CardBody>
                                                            <Row>   
                                                                <CardTitle tag="h6">{comentario.usuario.first_name} {comentario.usuario.last_name} - <Badge color="primary">{comentario.usuario.user_type}</Badge></CardTitle>
                                                                
                                                            </Row>
                                                            <CardText>
                                                                {comentario.comentario}
                                                            </CardText>
                                                            <small className="text-muted">{formatDateTime(comentario.data)}</small>
                                                        </CardBody>
                                                    </Card>
                                                ))}
                                            <CardText>
                                                    <textarea style={{width: "100%", height:"120px"}} value={novoComentario} onChange={(e) => setNovoComentario(e.target.value)} placeholder="Adicionar Comentário"
                                                    ></textarea>
                                            </CardText>
                                            <Button color="primary" 
                                                onClick={async() => {
                                                    const body = {   
                                                        "comentario": novoComentario,
                                                        "usuario": JSON.parse(sessionStorage.getItem('user')).user_id,
                                                        "budget": budget.budget_id
                                                      }
                                                    const data = await createComment(body);
                                                    if (data.status === 201) {
                                                        setAlert({type: 'success', message: 'Comentário adicionado com sucesso!'});
                                                        setTimeout(() => {
                                                            setAlert(null);
                                                        }, 3000);
                                                        setNovoComentario('');
                                                        fetchAndSetBudget();
                                                    } else {
                                                        setAlert({type: 'danger', message: 'Erro ao adicionar comentário!'});
                                                        setTimeout(() => {
                                                            setAlert(null);
                                                        }, 3000);
                                                    }
                                                }}
                                            >Salvar</Button>
                                        </CardBody>
                                    </Card>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                    
                    ) : <p>Nenhum documento de tradução cadastrado</p>}

                    { crcDocs.length > 0 && (
                        <Row className="mt-4">
                        <Col>
                        <h4>Documentos CRC</h4>
                            <Table striped>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Tipo</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {crcDocs.map(doc => (
                                    <tr key={doc.documento_id}>
                                        <td>{doc.nome}</td>
                                        <td>{doc.tipo_documento}</td>
                                        <td>{doc.descricao}</td>
                                        <td>R$ {doc.valor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        </Col>
                        </Row>
                    ) }
                    
                    <Row className="mt-4">
                    <h4>Serviços Documentos</h4>
                    {budget.servicos_documentos.length > 0 ? (
                        <Table striped>
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Quantidade</th>
                                <th>Valor Unitário</th>
                                <th>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budget.servicos_documentos.map(servDoc => (
                                <tr key={servDoc.servico_id}>
                                    <td>{servDoc.tipo_servico}</td>
                                    <td>{servDoc.quantidade}</td>
                                    <td>{servDoc.valor_unitario}</td>
                                    <td>R$ {servDoc.valor_total}</td>
                                </tr>
                            ))}
                        </tbody>
                        </Table>
                    ) : <p>Nenhum serviço de documento cadastrado</p>}
                    </Row>

                <Row>
                    <Col>
                        <p style={{color: "red"}}>Quantidade de documentos: {budget.documentos.length}</p>
                        <p></p>
                    </Col>
                    { hasAccess(['admin', 'gerencia', 'financeiro', 'comercial']) && (
                    <Col>
                        <p style={{color:"red"}}>Valor Total: <span style={{fontWeight:"bold"}}>R$ {budget.valor}</span></p>
                    </Col>  
                    )}
                </Row>
                {budget.observacoes && (
                <Row>
                    <p>Observação: {budget.observacoes}</p>
                </Row>
                )}

                <Row>
                    <h4>Responsável Fiscal</h4>
                    <Col>
                        {budget.responsaveis_fiscais.length > 0 ?  budget.responsaveis_fiscais.map((fiscal) => (
                            <Card key={fiscal.responsavel_fiscal_id}>
                                <CardBody>
                                    <CardTitle tag="h5">{fiscal.nome}</CardTitle>
                                    <CardText>
                                        <p><strong>CPF/CNPJ:</strong> {fiscal.cpf_cnpj}</p>
                                        <p><strong>Email:</strong> {fiscal.email}</p>
                                        <p><strong>Telefone:</strong> {fiscal.telefone}</p>
                                        <p><strong>Endereço:</strong> {fiscal.endereco}</p>
                                        <p><strong>CEP:</strong> {fiscal.cep}</p>
                                    </CardText>
                                </CardBody>
                            </Card>
                        )) : <p style={{fontSize:"15px", textAlign:"center"}}>Nenhum responsável fiscal cadastrado</p>}
                    </Col>
                </Row>
                </Col>
            </Row>
            { modals.etapaTraducao && (
                <TranslationStepsFormModal isOpen={modals.etapaTraducao} toggle={() => toggle('etapaTraducao')} translationDocuments={traducaoDocs} setAlert={setAlert} fetchAndSetItem={fetchAndSetBudget}/>
            )}
            { modals.assinaturaTraducao && (
                <TranslatorSignatureForm isOpen={modals.assinaturaTraducao} toggle={() => toggle('assinaturaTraducao')} translationDocuments={traducaoDocs} setAlert={setAlert} fetchAndSetItem={fetchAndSetBudget}/>
            )}
            { modals.cartorioCliente && (
                <CartorioClienteForm isOpen={modals.cartorioCliente} toggle={() => toggle('cartorioCliente')} translationDocuments={traducaoDocs} setAlert={setAlert} fetchAndSetItem={fetchAndSetBudget}/>
            )}
            { modals.editBudget && (
                <EditBudgetForm isOpen={modals.editBudget} toggle={() => toggle('editBudget')} budget={budget} setAlert={setAlert} fetchAndSetItem={fetchAndSetBudget}/>
            )}
            { modals.cancelBudget && (
                <Modal isOpen={modals.cancelBudget} toggle={() => toggle('cancelBudget')}>
                    <ModalHeader>Cancelar {budget.numero_ca ? 'Serviço' : 'Orçamento'}</ModalHeader>
                    <ModalBody>
                        <p>Tem certeza que deseja cancelar o {budget.numero_ca ? 'serviço' : 'orçamento'}?</p>
                        <Container style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button color="danger" 
                                onClick={async() => {
                                    const body = {
                                        status: 'CANCELADO',
                                        arquivado: true
                                    }
                                    const data = await patchBudget(budget.budget_id, body);
                                    if (!data) {
                                        setAlert({type: 'danger', message: `Erro ao cancelar ${budget.numero_ca ? 'serviço' : 'orçamento'}!`});
                                        setTimeout(() => {
                                            setAlert(null);
                                        }, 3000);
                                        return;
                                    }
                                    setAlert({type: 'success', message: `${budget.numero_ca ? 'Serviço' : 'Orçamento'} cancelado com sucesso!`});
                                    setTimeout(() => {
                                        setAlert(null);
                                    }, 3000);
                                }}
                            >Sim, cancelar</Button>              
                            <Button color="secondary" onClick={() => toggle('cancelBudget')}>Cancelar</Button>
                        </Container>
                    </ModalBody>
                </Modal>
            )}
            { modals.deleteBudget && (
                <Modal isOpen={modals.deleteBudget} toggle={() => toggle('deleteBudget')}>
                    <ModalHeader>Excluir {budget.numero_ca ? 'Serviço' : 'Orçamento'}</ModalHeader>
                    <ModalBody>
                        <p>Tem certeza que deseja excluir o {budget.numero_ca ? 'serviço' : 'orçamento'}?</p>
                        <Container style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button color="danger" 
                                onClick={async() => {
                                    const body = {
                                        status: 'CANCELADO',
                                        arquivado: true
                                    }
                                    const data = await patchBudget(budget.budget_id, body);
                                    if (!data) {
                                        setAlert({type: 'danger', message: `Erro ao cancelar ${budget.numero_ca ? 'serviço' : 'orçamento'}!`});
                                        setTimeout(() => {
                                            setAlert(null);
                                        }, 3000);
                                        return;
                                    }
                                    setAlert({type: 'success', message: `${budget.numero_ca ? 'Serviço' : 'Orçamento'} cancelado com sucesso!`});
                                    setTimeout(() => {
                                        setAlert(null);
                                    }, 3000);
                                }}
                            >Sim, excluir</Button>              
                            <Button color="secondary" onClick={() => toggle('deleteBudget')}>Cancelar</Button>
                        </Container>
                    </ModalBody>
                </Modal>
            )}
            {alert && (
                <Col style={{position: 'fixed', bottom: '10px', right: '10px'}}>
                    <Alert color={alert.type}>
                      {alert.message}{' '}
                      {alert.type === "danger" ? (
                        <FaTimes/>
                      ): 
                      <FaCheck/>
                      }
                    </Alert>
                </Col>
            )}
        </Container>
    );
};

export default BudgetDetails;