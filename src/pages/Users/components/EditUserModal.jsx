import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { editUser } from '../../../services/api';

const EditUserModal = ({ isOpen, toggle, user, setAlerts, setUsers}) => {
    const [formData, setFormData] = useState({
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: user.user_type,
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        if (formData.password && (formData.password !== formData.confirmPassword)) {
            setAlerts([{ type: 'danger', message: 'Senhas não conferem' }]);
            return;
        }
        const data = await editUser(formData.id ,formData);
        if (data.status  !== 200) {
            toggle();
            const errors = Object.keys(data.data).map((key) => data.data[key]);
            setAlerts(errors.map((error) => ({ type: 'danger', message: error })));
            setTimeout(() => {
                setAlerts([]);
            }, 3000);
            return;
        }
        setAlerts([{ type: 'success', message: 'Usuário editado com sucesso' }]);
        setUsers((prevState) => {
            const index = prevState.results.findIndex((u) => u.id === formData.id);
            prevState.results[index] = formData;
            return { ...prevState };
        });
        toggle();
        setTimeout(() => {
            setAlerts([]);
        }, 3000);
 
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Editar Usuário</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="username">Nome de Usuário</Label>
                        <Input type="text" name="username" id="username" value={formData.username} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="first_name">Nome</Label>
                        <Input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="last_name">Sobrenome</Label>
                        <Input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="user_type">Tipo de Usuário</Label>
                        <Input type="select" name="user_type" id="user_type" value={formData.user_type} onChange={handleChange} >
                            <option value="admin">Administrador</option>
                            <option value="colaborador">Colaborador</option>
                            <option value="gerencia">Gerência</option>
                            <option value="cliente">Cliente</option>
                            <option value="financeiro">Financeiro</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Senha</Label>
                        <Input type="password" name="password" id="password" value={formData.password} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="confirmPassword">Confirmar Senha</Label>
                        <Input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSave}>Salvar</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancelar</Button>
            </ModalFooter>
        </Modal>
    );
};

export default EditUserModal;