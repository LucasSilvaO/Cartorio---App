import { Button, Col, Modal, Row } from 'reactstrap';
import { FaFileAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BudgetForm from '../../../Budgets/BudgetForm';
import { useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import ClientForm from '../../../Client-Form/components/ClientForm';


const RegistrationMenu = ({setAlert}) => {
    const navigate = useNavigate();
    const [modals, setModals] = useState({
        service: false,
        budget: false,
        client: false
    });
    const { hasAccess } = useAuth();

    return (
        <Col sm="12" className="registration-menu bg-white" style={{padding: "20px", borderRadius: "10px"}}>
            <Row className="mb-3">
                <Col>
                    <Button color="white" block className="custom-button" style={{ color: "#95be1f"}} onClick={() => setModals({
                        ...modals,
                        client: !modals.client
                    })}>
                        <FaUser className="me-2" /> Cadastrar Assessoria
                    </Button>
                </Col>
            </Row>
            {hasAccess(['admin', 'gerencia', 'financeiro', 'colaborador']) && (
            <Row className="mb-3">
                <Col>
                    <Button color="danger" block className="custom-button" onClick={() => setModals({
                        ...modals,
                        service: !modals.service
                    })}>
                        <FaFileAlt className="me-2" /> Cadastrar Serviço
                    </Button>
                </Col>
            </Row>
            )}
            <Row className="mb-3">
                <Col>
                    <Button color="primary" block className="custom-button" onClick={() => navigate('/register-budget')}>
                        <FaFileAlt className="me-2" /> Cadastrar Orçamento
                    </Button>
                </Col>
            </Row>
            <Modal isOpen={modals.service} toggle={() => setModals(!modals.service)} size='lg'>
                <BudgetForm isService={true} />
            </Modal>
            {modals.client && <ClientForm modal={modals.client} toggle={() => setModals(!modals.client)} setAlert={setAlert}/>}
        </Col>
    );
};

export default RegistrationMenu;