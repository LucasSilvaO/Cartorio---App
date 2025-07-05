import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Card, CardBody, CardTitle, CardText, Alert, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createUser, editUser, fetchUsers, createSeller , deleteSeller} from '../../services/api';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { validateUser, createUserBody } from './utils/userUtils';
import { PaginationComponent } from '../../components/Pagination/Pagination';
import EditUserModal from './components/EditUserModal';
import { useAuth } from '../../hooks/useAuth';

const Users = () => {
    const [users, setUsers] = useState({
        count: 0,
        results: null,
    });
    const [formData, setFormData] = useState({
        username: '',
        nome: '',
        sobrenome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        atribuicao: '',
    });
    const { hasAccess } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [editUserModal, setEditUserModal] = useState(false);
    const [deleteUserModal, setDeleteUserModal] = useState(false);
    const [editFormData, setEditFormData] = useState(null)
    const [deleteFormData, setDeleteFormData] = useState(null);
    const [sellerCA, setSellerCA] = useState(null);

    const  toggleDeleteUserModal = () => {
        setDeleteUserModal(!deleteUserModal);
    };

    const toggleEditUserModal = () => {
        if(editUserModal) {
            setEditFormData(null);
        }
        setEditUserModal(!editUserModal);
    };

    const fetchAndSetUsers = async () => {
        const data = await fetchUsers();
        setUsers(data);
    }

    useEffect(() => {
        fetchAndSetUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                atribuicao: value,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const erros = validateUser(formData);
        if (erros.length > 0) {
          for (let i = 0; i < erros.length; i++) {
            setAlerts((prevState) => {
              return [
                ...prevState,
                {
                  type: "danger",
                  message: erros[i],
                },
              ];
            });
          }
          setTimeout(() => {
            setAlerts([]);
          }, 5000);
          return;
        }
        const body =  createUserBody(formData);
        const data = await createUser(body);
        if (data.status === 201) {
            if(formData.atribuicao.toLocaleLowerCase() === 'comercial') {
                const body = {
                    "nome": sellerCA.name,
                    "id_conta_azul": sellerCA.id,
                    "user": data.data.id,
                }
                const dataSeller = await createSeller(body);
                if (dataSeller.status !== 201) {
                    setAlerts((prevState) => {
                        return [
                            ...prevState,
                            {
                                type: 'danger',
                                message: 'Erro ao criar usuário comercial!'
                            }
                        ];
                    });
                    deleteSeller(data.data.id);
                    setTimeout(() => {
                        setAlerts([]);
                    }, 5000);
                    return;
                }
            }

            setAlerts((prevState) => {
                return [
                    ...prevState,
                    {
                        type: 'success',
                        message: 'Usuário cadastrado com sucesso!'
                    }
                ];
            });
            setTimeout(() => {
                setAlerts([]);
            }, 5000);
            fetchAndSetUsers();
        } else {
            const error = Object.keys(data.data);
            for (let i = 0; i < error.length; i++) {
                setAlerts((prevState) => {
                    return [
                        ...prevState,
                        {
                            type: 'danger',
                            message: data.data[error[i]][0]
                        }
                    ];
                });
            }
            setTimeout(() => {
                setAlerts([]);
            }, 5000);
        }
    };

    return (
        <Container>
            <Row>
                <Col md="4">
                    <h1>Cadastrar Usuário</h1>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="nome">Username</Label>
                            <Input type="text" name="username" id="username" value={formData.username} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="nome">Nome</Label>
                            <Input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="nome">Sobrenome</Label>
                            <Input type="text" name="sobrenome" id="sobrenome" value={formData.sobrenome} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="senha">Senha</Label>
                            <Input type="password" name="senha" id="senha" value={formData.senha} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="confirmarSenha">Confirmar Senha</Label>
                            <Input type="password" name="confirmarSenha" id="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Atribuição</Label>
                            <div>
                                <Label check>
                                    <Input type="checkbox" name="atribuicao" checked={formData.atribuicao === "comercial"} value={"comercial"} onChange={handleChange} /> Comercial
                                </Label>
                            </div>
                            <div>
                                <Label check>
                                    <Input type="checkbox" name="atribuicao" checked={formData.atribuicao === "colaborador"} value={"colaborador"} onChange={handleChange} /> Colaborador
                                </Label>
                            </div>
                            <div>
                                <Label check>
                                    <Input type="checkbox" name="atribuicao" checked={formData.atribuicao === "financeiro"} value={"financeiro"} onChange={handleChange} /> Financeiro
                                </Label>
                            </div>
                            <div>
                                <Label check>
                                    <Input type="checkbox" name="atribuicao" checked={formData.atribuicao === "gerencia"} value={"gerencia"} onChange={handleChange} /> Gerência
                                </Label>
                            </div>
                            <div>
                                <Label check>
                                    <Input type="checkbox" name="atribuicao" checked={formData.atribuicao === "cliente"} value={"cliente"} onChange={handleChange} /> Cliente
                                </Label>
                            </div>
                            {hasAccess(['admin']) && (
                            <div>
                                <Label check>
                                    <Input type="checkbox" name="atribuicao" checked={formData.atribuicao === "admin"} value={"admin"} onChange={handleChange} /> Administrador
                                </Label>

                            </div>
                            )}
                        </FormGroup>
                        <Button type="submit">Cadastrar Usuário</Button>
                    </Form>
                </Col>
                <Col md="8">
                    <Row>
                        <h1>Colaboradores</h1>
                        {users.results && users.results.map((user, index) => (
                            <Col md="4" key={index} style={{marginBottom: '10px'}}>
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">{user.username}</CardTitle>
                                        <CardTitle tag="h5">{user.first_name} {user.last_name}</CardTitle>
                                        <CardText>{user.email}</CardText>
                                        <CardText>
                                            <Badge color="primary">{user.user_type}</Badge>
                                        </CardText>
                                        <div className="d-flex justify-content-flex-start">
                                             <Button color="success" onClick={() => {
                                                 setEditFormData(user);
                                                 toggleEditUserModal();
                                             }}>Editar</Button>
                                             <div style={{marginLeft: '10px'}}/>
                                             <Button color="danger" 
                                                onClick={() => {
                                                    setDeleteFormData(user);
                                                    toggleDeleteUserModal();
                                                }}
                                             >Excluir</Button>
                                         </div>
                                    </CardBody>
                                </Card>
  
                            </Col>
                        ))}
                        <PaginationComponent items={users} setItems={setUsers} />
                    </Row>
                </Col>
            </Row>
            {alerts.length > 0 && (
                <Row >
                  <Col  style={{position: 'fixed', bottom: '10px', right: '10px', width: '300px'}}>
                    {alerts.map((alert, index) => (
                      <Alert key={index} color={alert.type}>
                        {alert.message}{' '}
                        {alert.type === "danger" ? (
                          <FaTimes/>
                        ): 
                        <FaCheck/>
                        }
                      </Alert>
                    ))}
                  </Col>
                </Row>
      )}
      { editFormData && (
        <EditUserModal isOpen={editUserModal} toggle={toggleEditUserModal} user={editFormData} setAlerts={setAlerts} setUsers={setUsers}/>
      )}

      { deleteFormData && (
            <Modal isOpen={deleteUserModal} toggle={toggleDeleteUserModal}>
                <ModalHeader toggle={toggleDeleteUserModal}>Excluir Usuário</ModalHeader>
                <ModalBody>
                    Tem certeza que deseja excluir o usuário {deleteFormData.username}?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={ async () => {
                        // delete user
                        const body = {
                            id: deleteFormData.id,
                            is_active: false
                        }
                        const data = await editUser(deleteFormData.id, body);
                        console.log(data);
                        if (data.status === 200) {
                            setAlerts((prevState) => {
                                return [
                                    ...prevState,
                                    {
                                        type: 'success',
                                        message: 'Usuário excluído com sucesso!'
                                    }
                                ];
                            });
                            setTimeout(() => {
                                setAlerts([]);
                            }, 5000);
                            fetchAndSetUsers();
                            toggleDeleteUserModal();
                        } else {
                            const error = Object.keys(data.data);
                            for (let i = 0; i < error.length; i++) {
                                setAlerts((prevState) => {
                                    return [
                                        ...prevState,
                                        {
                                            type: 'danger',
                                            message: data.data[error[i]][0]
                                        }
                                    ];
                                });
                            }
                            toggleDeleteUserModal();
                            setTimeout(() => {
                                setAlerts([]);
                            }, 5000);
                        }
                    }}>Excluir</Button>{' '}
                    <Button color="secondary" onClick={toggleDeleteUserModal}>Cancelar</Button>
                </ModalFooter>
            </Modal>
      )}
        
        </Container>
    );
};

export default Users;