import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Alert, Col } from 'reactstrap';
import { createUser, fetchUserById, editUser, editClient } from '../../../services/api';
import { createUserBody, validateUser } from '../../Users/utils/userUtils';
import { FaCheck, FaTimes } from 'react-icons/fa';

const CreateClientUserModal = ({isOpen, toggle, client, fetchAndSetClient}) => {
    const [user, setUser] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        nome: '',
        sobrenome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        atribuicao: 'cliente'
    });

    const fetchAndSetUser = async () => {
        const data = await fetchUserById(client.usuario);
        setUser(data);
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
        const erros = validateUser(formData);
        if (erros.length > 0) {
            for (let i = 0; i < erros.length; i++) {
                setAlerts((prevState) => {
                    return [
                        ...prevState,
                        {
                            type: "danger",
                            message: erros[i]
                        }
                    ];
                });
            }
            setTimeout(() => {
                setAlerts([]);
            }, 5000);
            return;
        }
        const body =  createUserBody(formData);
        if(!client.usuario) {
            const data = await createUser(body);
            if (data.status === 201) {
                setAlerts((prevState) => {
                    return [
                        ...prevState,
                        {
                            type: 'success',
                            message: 'Usuário cadastrado com sucesso!'
                        }
                    ];
                });
                const bodyClient = {
                    cliente_id: client.cliente_id,
                    usuario: data.data.id
                }
                const clienteEditado = await editClient(bodyClient);
                if (!clienteEditado.detail) {
                    setAlerts((prevState) => {
                        return [
                            ...prevState,
                            {
                                type: 'success',
                                message: 'Usuário vinculado ao cliente com sucesso!'
                            }
                        ];
                    });
                }
                fetchAndSetClient();
                setTimeout(() => {
                    setAlerts([]);
                }, 5000);
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
        } else {
           const usuarioEditado = await editUser(client.usuario, body);
              if (!usuarioEditado.detail) {
                setAlerts((prevState) => {
                     return [
                          ...prevState,
                          {
                            type: 'success',
                            message: 'Usuário editado com sucesso!'
                          }
                     ];
                });
                setTimeout(() => {
                    setAlerts([]);
                }, 5000);
              }
              else {
                const error = Object.keys(usuarioEditado);
                for (let i = 0; i < error.length; i++) {
                    setAlerts((prevState) => {
                        return [
                            ...prevState,
                            {
                                type: 'danger',
                                message: usuarioEditado[error[i]][0]
                            }
                        ];
                    });
                }
                setTimeout(() => {
                    setAlerts([]);
                }, 5000);
            }
        }

    };

    useEffect(() => {
        if(client.usuario) {
            fetchAndSetUser();
        }
        
    }, []);

    useEffect(() => {
        if(user) {
            setFormData({
                username: user.username,
                nome: user.first_name,
                sobrenome: user.last_name,
                email: user.email,
                senha: "",
                confirmarSenha: "",
                atribuicao: "cliente"
            });
        }
    }, [user]);

    return (
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>{client.usuario ? "Editar" : "Cadastrar Novo"} Usuário</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="username">Nome de Usuário</Label>
                            <Input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="nome">Nome</Label>
                            <Input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="sobrenome">Sobrenome</Label>
                            <Input type="text" name="sobrenome" id="sobrenome" value={formData.sobrenome} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">E-mail</Label>
                            <Input type="text" name="email" id="email" value={formData.email} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="senha">Senha</Label>
                            <Input type="password" name="senha" id="senha" value={formData.senha} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="confirmarSenha">Repetir Senha</Label>
                            <Input type="password" name="confirmarSenha" id="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required />
                        </FormGroup>
                        <Button color="primary" type="submit">{client.usuario ? "Editar" : "Cadastrar"}</Button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Cancelar</Button>
                </ModalFooter>
                {alerts.length > 0 && (
                <Row>
                  <Col md={2} style={{position: 'fixed', bottom: '10px', right: '10px'}}>
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
            </Modal>
    );
};

export default CreateClientUserModal;