import React from 'react';
import { BiUser } from 'react-icons/bi';
import { Card, CardBody, CardTitle, Button, Container, Modal } from 'reactstrap';
import EditClientForm from './EditClientForm';
import DeleteClientModal from './DeleteClientModal';
import { useNavigate } from 'react-router-dom';
import BudgetForm from '../../Budgets/BudgetForm';
import CreateClientUserModal from './CreateClientUserForm';

const MenuClientDetails = ({ client, setClient, fetchAndSetClient }) => {
    const [modalEdit, setModalEdit] = React.useState(false);
    const [modalDelete, setModalDelete] = React.useState(false);
    const [modalCreateService, setModalCreateService] = React.useState(false);
    const [modalCreateUser, setModalCreateUser] = React.useState(false);
    const navigate = useNavigate();
    const toggleModalEdit = () => setModalEdit(!modalEdit);
    const toggleModalDelete = () => setModalDelete(!modalDelete);
    const toggleCreateService = () => setModalCreateService(!modalCreateService);
    const toggleCreateUser = () => setModalCreateUser(!modalCreateUser);

    return (
        <div>
        <Card className="mt-4 h-100" style={{backgroundColor: "#BF202D"}}>
            <CardBody>
                <CardTitle tag="h5" style={{color: "white", fontSize:"35px"}}><BiUser/>{` `}{client.nome}</CardTitle>
                <Container className="d-flex justify-content-between">
                    <Button color="primary" className="mr-2" style={{fontSize: "12px"}} onClick={() => {
                        toggleCreateService();
                    }}><BiUser /> Adicionar novo Serviço</Button>
                    <Button color="success" className="mr-2" style={{fontSize: "12px"}} onClick={toggleCreateUser}><BiUser /> {client.usuario ? "Editar": "Criar"} Usuário</Button>
                    <Button color="secondary" className="mr-2" style={{fontSize: "12px"}} onClick={toggleModalEdit}><BiUser /> Editar Cliente</Button>
                    <Button color="danger" style={{fontSize: "12px"}} onClick={toggleModalDelete}><BiUser /> Excluir</Button>
                </Container>
            </CardBody>
        </Card>
        <EditClientForm modal={modalEdit} toggle={toggleModalEdit} client={client} setClient={setClient}/>
        <DeleteClientModal isOpen={modalDelete} toggle={toggleModalDelete} client={client} onClientDeleted={() => navigate('/clients')} />
        <Modal isOpen={modalCreateService} toggle={() => setModalCreateService(!modalCreateService)} size='lg'>
                <BudgetForm isService={true} client={client}/>
        </Modal>
        <CreateClientUserModal isOpen={modalCreateUser} toggle={toggleCreateUser} client={client} fetchAndSetClient={fetchAndSetClient}/>
        </div>
    );
};

export default MenuClientDetails;