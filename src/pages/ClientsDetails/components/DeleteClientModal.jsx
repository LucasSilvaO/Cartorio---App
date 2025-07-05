import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { editClient } from '../../../services/api';

const DeleteClientModal = ({ isOpen, toggle, client, onClientDeleted }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const data = await editClient( { cliente_id: client.cliente_id, ativo: false });
            toggle();
            onClientDeleted()
        } catch (error) {
            console.error('Failed to delete client', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Excluir Cliente</ModalHeader>
            <ModalBody>
                Você tem certeza que deseja excluir este cliente?
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle} disabled={loading}>Cancel</Button>
                <Button color="danger" onClick={handleDelete} disabled={loading}>
                    {loading ? 'Excluindo...' : 'Excluir'}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteClientModal;