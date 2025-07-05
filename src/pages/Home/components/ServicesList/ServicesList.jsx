import React, { useState } from 'react';
import { Badge, Row, Table, Tooltip } from 'reactstrap';
import { calculateDaysDifference, formatDate } from '../../../../utils/formatDate';
import '../ServicesList/css/serviceList.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';

const ServicesList = ({ services }) => {
    const [tooltipOpen, setTooltipOpen] = useState({});
    const { hasAccess } = useAuth();

    const toggleTooltip = (index) => {
        setTooltipOpen(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const serviceTypes = (service) => {
        const serviceTypeMapping = {
            APOSTILAMENTO: 'Apostilamento',
            POSTAGEMENVIO: 'Postagem/Envio',
            TRADUCAO: 'Tradução',
            CRC: 'CRC'
        };
    
        // Coleta os tipos de serviços e documentos
        const tipos = [
            ...service.servicos_documentos.map(doc => serviceTypeMapping[doc.tipo_servico] || doc.tipo_servico),
            ...service.documentos.map(doc => serviceTypeMapping[doc.tipo_documento] || doc.tipo_documento)
        ];
    
        // Remove duplicatas usando Set
        const tiposUnicos = [...new Set(tipos)];
    
        // Retorna como string separada por vírgula
        return tiposUnicos.join(', ');
    };


    const getDataDeEnvioTraducao = (service) => {
        const dataDeEnvioTraducao = service.documentos.map(doc => doc.data_entrada_tradutor);
        const dataDeEnvioTraducaoFiltrada = dataDeEnvioTraducao.filter(data => data !== null);
        if (dataDeEnvioTraducaoFiltrada.length === 0) return 'N/A';
        return dataDeEnvioTraducaoFiltrada[0];
    };

    const getPrazoTraducao = (service) => {
        const prazoTraducao = service.documentos.map(doc => doc.prazo);
        const prazoTraducaoFiltrado = prazoTraducao.filter(prazo => prazo !== null);
        if (prazoTraducaoFiltrado.length === 0) return 'N/A';
        return prazoTraducaoFiltrado[0];
    };

    const countDocuments = (service) => {
        const totalDocuments = service.documentos.reduce((acc, doc) => {
            return acc + (doc.quantidade || 0);
        }, 0);
        return totalDocuments;
    };

    return (
        <Row className='mt-2 m-2' style={{ borderRadius: "10px", backgroundColor:"#95be1f", color: "white", padding: "10px" }}>
            <h3>Serviços</h3>
            <Table striped responsive style={{ borderRadius: "10px" }}>
                <thead style={{ backgroundColor: "#95be1f", color: "white", borderRadius: "10px", height: "50px", textAlign: "center" }}>
                    <tr>
                        <th>Nome da Familia</th>
                        <th>Assesoria</th>
                        <th>N° Doc.</th>
                        <th>O.S</th>
                        <th>Tipo de Serviço</th>
                        {hasAccess(['admin', 'gerencia', 'financeiro', 'colaborador', 'cliente']) && (
                            <>
                                <th>Data de Entrada</th>
                                <th>Data de Envio</th>
                                <th>Tempo Restante</th>
                                <th>Ações</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {services.results && services.results.map((service, index) => (
                        <tr key={index} className="table-row" style={{ color: "black", textAlign: "center", height: "50px" }}>
                            <td>
                                {hasAccess(['admin', 'gerencia', 'financeiro', 'colaborador', 'cliente']) ? (
                                    <Link to={`/budgets/${service.budget_id}`} style={{ color: "black" }}>
                                        {service.familia.nome_da_familia}
                                    </Link>
                                ) : service.familia.nome_da_familia}
                            </td>
                            <td>
                            {hasAccess(['admin', 'gerencia', 'financeiro', 'colaborador', 'cliente']) ? (
                                    <Link to={`/clients/${service.cliente.cliente_id}`} style={{ color: "black" }}>
                                        {service.cliente.nome}
                                    </Link>
                                ) : service.cliente.nome
                                }
                            </td>
                            <td>{countDocuments(service)}</td>
                            <td>{service.numero_ca}</td>
                            <td>{serviceTypes(service)}</td>
                            {hasAccess(['admin', 'gerencia', 'financeiro', 'colaborador', 'cliente']) && (
                                <>
                                    <td>{formatDate(service.data_criacao)}</td>
                                    <td>{getDataDeEnvioTraducao(service) !== "N/A" ? formatDate(getDataDeEnvioTraducao(service)) : "N/A"}</td>
                                    <td>
                                        {service.status === "FINALIZADO" ? (
                                            <Badge color="success">Finalizado</Badge>
                                        ) : (
                                            getPrazoTraducao(service) !== "N/A" ? (
                                                <Badge color={calculateDaysDifference(new Date(), getPrazoTraducao(service)) < 0 ? "danger" : calculateDaysDifference(new Date(), getPrazoTraducao(service)) < 3 ? "warning" : "success"}>
                                                    {calculateDaysDifference(new Date(), getPrazoTraducao(service)) < 0 ? "Atrasado" : "Restam"}{" "}
                                                    {Math.abs(calculateDaysDifference(new Date(), getPrazoTraducao(service)))} dia(s)
                                                </Badge>
                                            ) : "N/A"
                                        )}
                                    </td>
                                    <td>
                                        <Badge id={`Tooltip-${index}`} style={{ cursor: "pointer" }}>...</Badge>
                                        <Tooltip
                                            placement="top"
                                            isOpen={tooltipOpen[index] || false}
                                            target={`Tooltip-${index}`}
                                            toggle={() => toggleTooltip(index)}
                                            style={{ backgroundColor: " #95be1f", color: "white", padding: "10px" }}
                                        >
                                            <p>Tradutor: {service.documentos[0].tradutor ? service.documentos[0].tradutor.nome : <Badge color="warning" style={{ padding: "10px" }}>Aguardando</Badge>}</p>
                                            <p>Modalidade: {service.documentos[0].modalidade ? service.documentos[0].modalidade : <Badge color="warning" style={{ padding: "10px" }}>Aguardando</Badge>}</p>
                                            <p>Status Assinatura: {service.documentos[0].data_envio_tradutor ? formatDate(service.documentos[0].data_envio_tradutor) : <Badge color="warning" style={{ padding: "10px" }}>Aguardando Envio</Badge>}</p>
                                            <p>Envio Cartório: {service.documentos[0].data_envio_cartorio ? formatDate(service.documentos[0].data_envio_cartorio) : <Badge color="warning" style={{ padding: "10px" }}>Aguardando Envio</Badge>}</p>
                                            <p>Status: {service.status}</p>
                                        </Tooltip>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Row>
    );
};

export default ServicesList;