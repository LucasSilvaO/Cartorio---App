import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';
import { fetchTranslators, fetchServicesByParams, fetchServicesByClientWithParams } from '../../../../services/api';
import { useAuth } from '../../../../hooks/useAuth';

const HomeFilter = ({setAlert, setServices, fetchAndSetServices, isClient}) => {
    const { user, userType } = useAuth();
    const { hasAccess } = useAuth();
    const [formData, setFormData] = useState({
        familia: '',
        assessoria: '',
        os: '',
        tipoServico: 'Todos os Tipos de Serviço',
        tradutor: '',
        dataInicio: '',
        dataFim: '',
        statusServico: '',
        prazo: 'Todos os Prazos',
        apenasMeusServicos: userType === 'comercial' ? true : false
    });
    const [translators , setTranslators] = useState([]);


    const fetchAndSetTranslators = async () => {
        const data = await fetchTranslators();
        setTranslators(data.results);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFilter = async () => {
        // Implement filter logic here
        console.log('Filtering with data:', formData);
        const params = {
            startDate: formData.dataInicio,
            endDate: formData.dataFim,
            familia: formData.familia,
            clientName: formData.assessoria,
            numeroCA: formData.os,
            tipoServico: formData.tipoServico,
            tradutor: formData.tradutor,
            statusServico: formData.statusServico,
            prazoVencimento: formData.prazo,
            apenasMeusServicos: formData.apenasMeusServicos
        };
        let services
        if(isClient) {
            services = await fetchServicesByClientWithParams(user.cliente.cliente_id,params);

        } else {
        services = await fetchServicesByParams(params);
        } console.log(services)
        if(services.data.results.length === 0) {
            setAlert({ type: 'danger', message: 'Nenhum serviço encontrado!' });
            setTimeout(() => {
                setAlert(null);
            }, 3000);
            return;
        }
        setServices(services.data);
        setAlert({ type: 'success', message: `Filtro Aplicado, encontrado(s) ${services.data.results.length} serviço(s)!` });
        setTimeout(() => {
            setAlert(null);
        }, 3000);

    };

    const handleClear = () => {
        setFormData({
            familia: '',
            assessoria: '',
            os: '',
            tipoServico: 'Todos os Tipos de Serviço',
            tradutor: '',
            dataInicio: '',
            dataFim: '',
            statusServico: 'Aberto',
            prazo: 'Todos os Prazos',
            apenasMeusServicos: false
        });
        fetchAndSetServices();
    };

    useEffect(() => {
        fetchAndSetTranslators();
    }, []);

    return (
        <Row className='mt-2 m-2 bg-white' style={{ borderRadius: "10px", backgroundColor: "white" ,padding: "20px",alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <Form >
            <Col style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
            <FormGroup row>
                <Col sm={11}>
                    <Input type="text" name="familia" id="familia" value={formData.familia} onChange={handleChange} placeholder='Família'/>
                </Col>
            </FormGroup>
            { !isClient && (
                <FormGroup row>
                    <Col sm={11}>
                        <Input type="text" name="assessoria" id="assessoria" value={formData.assessoria} onChange={handleChange} placeholder='Assessoria'/>
                    </Col>
                </FormGroup>
            )}

            <FormGroup row>
                <Col sm={11}>
                    <Input type="text" name="os" id="os" value={formData.os} onChange={handleChange} placeholder='O.S'/>
                </Col>
            </FormGroup>
            </Col>
            <FormGroup row>
                <Col sm={10}>
                    <Input type="select" name="tipoServico" id="tipoServico" value={formData.tipoServico} onChange={handleChange}>
                        <option>Todos os Tipos de Serviço</option>
                        <option value={"APOSTILAMENTO"}>Apostilamento</option>
                        <option value={"CRC"}>CRC</option>
                        <option value={"POSTAGEMENVIO"}>Postagem/Envio</option>
                        <option value={"TRADUCAO"}>Tradução</option>
                    </Input>
                </Col>
            </FormGroup>

            <FormGroup row>
                <Col sm={10}>
                    <Input type="select" name="tradutor" id="tradutor" value={formData.tradutor} onChange={handleChange}>
                        <option value={""}>Todos os Tradutores</option>
                        {translators.map((tradutor, index) => (
                            <option key={index} value={tradutor.tradutor_id}>{tradutor.nome}</option>
                        ))}
                    </Input>
                </Col>
            </FormGroup>
            <Col style={{display: "flex", flexDirection: "row",  flexWrap: "wrap"}}>
            <FormGroup>
                <Label for="dataInicio" sm={2} style={{color:"black"}}>Início:</Label>
                <Col sm={11}>
                    <Input type="date" name="dataInicio" id="dataInicio" value={formData.dataInicio} onChange={handleChange} />
                </Col>
            </FormGroup>
            <FormGroup>
                <Label for="dataFim" sm={2} style={{color:"black"}}>Final:</Label>
                <Col sm={11}>
                    <Input type="date" name="dataFim" id="dataFim" value={formData.dataFim} onChange={handleChange} />
                </Col>
            </FormGroup>
            </Col>
            { hasAccess(['admin', 'gerencia', 'financeiro', 'colaborador', 'cliente']) && (
            <div>  
            <FormGroup row>
                <Col sm={10}>
                    <Input type="select" name="statusServico" id="statusServico" value={formData.statusServico} onChange={handleChange}>
                        <option>Selecione o status do serviço</option>
                        <option>Serviço Aberto</option>
                        <option>Serviço Fechado</option>
                    </Input>
                </Col>
            </FormGroup>
            <FormGroup>
                <Col sm={10}>
                    <Input type="select" name="prazo" id="prazo" value={formData.prazo} onChange={handleChange}>
                        <option>Todos os Prazos</option>
                        <option>Falta 3 dias</option>
                        <option>Falta 2 dias</option>
                        <option>Falta 1 dia</option>
                        <option>Vence hoje</option>
                        <option>Venceu 1 dia</option>
                        <option>Venceu 2 dias</option>
                        <option>Venceu mais de 3 dias</option>
                    </Input>
                </Col>
            </FormGroup>
            </div>
        )}
            {/* <FormGroup row>
                <Col sm={10}>
                    <Input type='checkbox' name='sellerServices' id='sellerServices' value={formData.apenasMeusServicos} onChange={() => {
                        setFormData({...formData, apenasMeusServicos: !formData.apenasMeusServicos});
                    }} checked={formData.apenasMeusServicos} />
                    <Label for='sellerServices' style={{color: "black", marginLeft:"2px"}}>Exibir apenas meus serviços</Label>
                </Col>
            </FormGroup> */}
            <FormGroup row>
                <Col sm={{ size: 10, offset: 2 }}>
                    <Button color="primary" onClick={handleFilter}>Filtrar</Button>{' '}
                    <Button color="secondary" onClick={handleClear}>Limpar Filtros</Button>
                </Col>
            </FormGroup>
        </Form>
        </Row>
    );
};

export default HomeFilter;