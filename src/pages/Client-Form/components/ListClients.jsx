import React from 'react';
import { Table } from 'reactstrap';
import '../css/client.css';
import { Link } from 'react-router-dom';

const ListClients = ({ clients }) => {
    if (clients.length === 0) {
        return (
            <h2 style={{textAlign: "center"}}>Nenhum cliente encontrado</h2>
        );
    }
    return (
        <Table >
            <thead className="custom-thead">
                <tr>
                    <th>Nome</th>
                    <th>Modalidade</th>
                    <th>Responsável</th>
                </tr>
            </thead>
            <tbody>
                {clients.length > 0 && clients.map(client => (    
                        <tr key={client.cliente_id}>                         
                            <td><Link to={`/clients/${client.cliente_id}`}>{client.nome}</Link></td>                          
                            <td>{client.tipo_do_cliente}</td>
                            <td>{client.nome_do_representante}</td>
                            
                        </tr>                   
                ))}
            </tbody>
        </Table>
    );
};

export default ListClients;