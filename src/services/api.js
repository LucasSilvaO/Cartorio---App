import { API_BACK_URL } from '../../src/config/config';

export const fetchTranslators = async () => {
    try {
        const response = await fetch(`${API_BACK_URL}/tradutores/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
            });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar tradutores:', error);
    }
};

export const editTranslator = async (translator) => {
    try {
        const token = sessionStorage.getItem('token');
        const headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Token ${token}`
        });
        const requestOptions = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(translator)
        };
        const response = await fetch(`${API_BACK_URL}/tradutores/${translator.tradutor_id}/`, requestOptions);
        const data = await response.json();
        return data;
        }
    catch (error) {
        console.error('Error:', error);
    }
}

export const createTranslator = async (translator) => {
    try {
        const token = sessionStorage.getItem('token');
        const headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Token ${token}`
        });
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(translator)
        };
        const response = await fetch(`${API_BACK_URL}/tradutores/`, requestOptions);
        const data = await response.json();
        return data;
        }
    catch (error) {
        console.error('Error:', error);
    }
}

export const fetchClients = async (page) => {
    try {
        const response = await fetch(`${API_BACK_URL}/clientes?${page ? `page=${page}` : ""}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
            });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Erro ao buscar clientes:', error);
    }
}

export const fetchClientByParams = async (nome, tipo) => {
    const paramsArray = [];
    if (nome) paramsArray.push(`nome=${nome}`);
    if (tipo) paramsArray.push(`tipo_do_cliente=${tipo}`);
    const params = paramsArray.join('&');
    try {
        const response = await fetch(`${API_BACK_URL}/clientes?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
            });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Erro ao buscar clientes:', error);
    }
}

export const createClient = async (client) => {
    try {
        const token = sessionStorage.getItem('token');
        const headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Token ${token}`
        });
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(client)
        };
        const response = await fetch(`${API_BACK_URL}/clientes/`, requestOptions);
        const data = await response.json();
        return data;
        }
    catch (error) {
        console.error('Error:', error);
    }
}

export const fetchClientById = async (id) => {
    try {
        const response = await fetch(`${API_BACK_URL}/clientes/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
            });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Erro ao buscar cliente:', error);
    }
}

export const editClient = async (client) => {
    try {
        const token = sessionStorage.getItem('token');
        const headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Token ${token}`
        });
        const requestOptions = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(client)
        };
        const response = await fetch(`${API_BACK_URL}/clientes/${client.cliente_id}/`, requestOptions);
        const data = await response.json();
        return data;
        }
    catch (error) {
        console.error('Error:', error);
    }
}

export const createBudget = async (budget) => {
    try {
        const token = sessionStorage.getItem('token');
        const headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Token ${token}`
        });
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(budget)
        };
        const response = await fetch(`${API_BACK_URL}/orcamentos/`, requestOptions);
        const data = await response.json();
        return {
            status: response.status,
            data: data
        }
        }
    catch (error) {
        console.error('Error:', error);
        return {
            status: 500,
            data: null
        }
    }
}

export const fetchBudgets = async () => {
    try {
        const response = await fetch(`${API_BACK_URL}/orcamentos/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
            });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
    }
}

export const fetchBudgetsByParams = async (startDate, endDate, clientName, archived, pageNumber) => {
    const paramsArray = [];
    if (startDate) paramsArray.push(`data_criacao__gte=${startDate}`);
    if (endDate) paramsArray.push(`data_criacao__lte=${endDate}`);
    if (clientName) paramsArray.push(`cliente=${clientName}`);
    if (archived) paramsArray.push(`arquivado=${archived}`);
    if (pageNumber) paramsArray.push(`page=${pageNumber}`);
    const params = paramsArray.join('&');
    try {
        const response = await fetch(`${API_BACK_URL}/orcamentos?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
            });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
    }
}

export const fetchServiceById = async (id) => {
    try {
        const response = await fetch(`${API_BACK_URL}/servicos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
            });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Erro ao buscar serviço:', error);
    }
}

export const fetchBudgetById = async (id) => {
    try {
        const response = await fetch(`${API_BACK_URL}/orcamentos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
            });
        const data = await response.json();
        if (response.status === 404) {
            const data = await fetchServiceById(id);
            return data;
        }
        return data;
    }
    catch (error) {
        console.error('Erro ao buscar orçamento:', error);
    }
}

export const patchService = async (serviceId, serviceBody) => {
    try {
        const token = sessionStorage.getItem('token');
        const headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Token ${token}`
        });
        const requestOptions = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(serviceBody)
        };
        const response = await fetch(`${API_BACK_URL}/servicos/${serviceId}/`, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            return null;
        }
        return data;
        }
    catch (error) {
        console.error('Error:', error);
    }
}

export const patchBudget = async (budgetId, budgetBody) => {
    try {
        const token = sessionStorage.getItem('token');
        const headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Token ${token}`
        });
        const requestOptions = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(budgetBody)
        };
        const response = await fetch(`${API_BACK_URL}/orcamentos/${budgetId}/`, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            const data = await patchService(budgetId, budgetBody);
            return data;
        }
        return data;
        }
    catch (error) {
        console.error('Error:', error);
    }
}

export const fetchServices = async () => {
    try {
        const response = await fetch(`${API_BACK_URL}/servicos/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
        }});
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Erro ao buscar serviços:', error);
    }
        
}

export const createServiceCA = async (budget_id) => {
    try {
        const response = await fetch(`${API_BACK_URL}/budget-sale/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({
                "budget_id": budget_id
            })
        });
        const data = await response.json();
        return {
            status: response.status,
            data: data
        };
    }
    catch (error) {
        console.error('Erro ao criar serviço:', error);
    }
}

export const fetchServicesByParams = async ({startDate, endDate, familia, clientName, numeroCA, tipoServico, tradutor, statusServico, prazoVencimento, pageNumber, clientId, apenasMeusServicos}) => {
    const paramsArray = [];
    if (startDate) paramsArray.push(`data_criacao__gte=${startDate}`);
    if (endDate) paramsArray.push(`data_criacao__lte=${endDate}`);
    if (familia) paramsArray.push(`familia=${familia}`);
    if (clientName) paramsArray.push(`cliente=${clientName}`);
    if (numeroCA) paramsArray.push(`numero_ca=${numeroCA}`);
    if (tipoServico && tipoServico !== "Todos os Tipos de Serviço") paramsArray.push(`tipo_de_servico=${tipoServico}`);
    if (tradutor) paramsArray.push(`tradutor=${tradutor}`);
    if (statusServico === "Serviço Fechado") {
        paramsArray.push(`finalizado=true`);
    } else if (statusServico === "Serviço Aberto") {
        paramsArray.push(`finalizado=false`);
    }    if (prazoVencimento) paramsArray.push(`prazo_vencimento=${prazoVencimento}`);
    if (clientId) paramsArray.push(`cliente_id=${clientId}`);
    if (apenasMeusServicos) paramsArray.push(`apenas_meus_servicos=${apenasMeusServicos}`);
    if (pageNumber) paramsArray.push(`page=${pageNumber}`);

    const params = paramsArray.join('&');
    try {
        const response = await fetch(`${API_BACK_URL}/servicos/?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
        }});
        const data = await response.json();
        return {
            status: response.status,
            data: data
        }
    }
    catch (error) {
        console.error('Erro ao buscar serviços:', error);
    }
}

export const fetchServicesByClient = async (clientId) => {
    try {
        const response = await fetch(`${API_BACK_URL}/clientes/${clientId}/servicos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
        }});
        const data = await response.json();
        return {
            status: response.status,
            data: data
        }
    }
    catch (error) {
        console.error('Erro ao buscar serviços:', error);
    }
}

export const fetchServicesByClientWithParams = async (clientId, {startDate, endDate, familia, clientName, numeroCA, tipoServico, tradutor, statusServico, prazoVencimento, pageNumber, apenasMeusServicos}) => {
    const paramsArray = [];
    if (startDate) paramsArray.push(`data_criacao__gte=${startDate}`);
    if (endDate) paramsArray.push(`data_criacao__lte=${endDate}`);
    if (familia) paramsArray.push(`familia=${familia}`);
    if (clientName) paramsArray.push(`cliente=${clientName}`);
    if (numeroCA) paramsArray.push(`numero_ca=${numeroCA}`);
    if (tipoServico && tipoServico !== "Todos os Tipos de Serviço") paramsArray.push(`tipo_de_servico=${tipoServico}`);
    if (tradutor) paramsArray.push(`tradutor=${tradutor}`);
    if (apenasMeusServicos) paramsArray.push(`apenas_meus_servicos=${apenasMeusServicos}`);
    if (statusServico === "Serviço Fechado") {
        paramsArray.push(`finalizado=true`);
    } else if (statusServico === "Serviço Aberto") {
        paramsArray.push(`finalizado=false`);
    }    if (prazoVencimento) paramsArray.push(`prazo_vencimento=${prazoVencimento}`);
    if (pageNumber) paramsArray.push(`page=${pageNumber}`);

    const params = paramsArray.join('&');
    try {
        const response = await fetch(`${API_BACK_URL}/clientes/${clientId}/servicos/?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
        }});
        const data = await response.json();
        return {
            status: response.status,
            data: data
        }
    }
    catch (error) {
        console.error('Erro ao buscar serviços:', error);
    }
}

export const fetchWithUrl = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
            });
        const data = await response.json();
        return data;
    }   
    catch (error) {
        console.error('Erro ao buscar:', error);
    }
}

export const fetchUsers = async () => {
    try {
        const response = await fetch(`${API_BACK_URL}/usuarios/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
        }});
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

export const createUser = async (user) => {
    try {
        const response = await fetch(`${API_BACK_URL}/usuarios/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(user)
        });
        const data = await response.json();

        return {
            status: response.status,
            data: data
        };
    }
    catch (error) {
        console.error('Erro ao criar usuário:', error);
    }
}

export const fetchUserById = async (id) => {
    try {
        const response = await fetch(`${API_BACK_URL}/usuarios/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
        }});
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Erro ao buscar usuário:', error);
    }
}

export const editUser = async (user_id, user) => {
    try {
        const token = sessionStorage.getItem('token');
        const headers = new Headers({
            'Content-Type': 'application/json',
            "Authorization": `Token ${token}`
        });
        const requestOptions = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(user)
        };
        const response = await fetch(`${API_BACK_URL}/usuarios/${user_id}/`, requestOptions);
        const data = await response.json();
        return {
            status: response.status,
            data: data
        };
        }
    catch (error) {
        console.error('Error:', error);
    }
}

export const fetchUsersByParams = async (tipo, pageNumber) => {
    const paramsArray = [];
    if (tipo) paramsArray.push(`user_type=${tipo}`);
    if (pageNumber) paramsArray.push(`page=${pageNumber}`);
    const params = paramsArray.join('&');
    try {
        const response = await fetch(`${API_BACK_URL}/usuarios/?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
        }});
        const data = await response.json();
        return {
            status: response.status,
            data: data
        }
    }
    catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
    
}

export const createComment = async (commentBody) => {
    try {
        const response = await fetch(`${API_BACK_URL}/comentarios/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(commentBody)
        });
        const data = await response.json();
        return {
            status: response.status,
            data: data
        };
    }
    catch (error) {
        console.error('Erro ao criar comentário:', error);
    }
};

export const fetchServicesCA = async (page, page_size) => {
    try {
        const response = await fetch(`${API_BACK_URL}/conta-azul/sales/?page=${page}&page_size=${page_size}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
        }});
        const data = await response.json();
        return {
            status: response.status,
            data: data
        }
    }
    catch (error) {
        console.error('Erro ao buscar serviços:', error);
    }
}

export const fetchServicesCAByParams = async (startDate, endDate, page, termo_busca) => {
    const paramsArray = [];
    if (startDate) paramsArray.push(`emission_start=${startDate}`);
    if (endDate) paramsArray.push(`emission_end=${endDate}`);
    if (termo_busca) paramsArray.push(`termo_busca=${termo_busca}`);
    paramsArray.push(`page=${page}`);
    paramsArray.push(`page_size=500`);
    paramsArray.push(`termo_busca=${termo_busca}`); // Para buscar todos os serviços, caso não tenha termo de busca
    const params = paramsArray.join('&');
    try {
        const response = await fetch(`${API_BACK_URL}/conta-azul/sales/?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
        }});
        const data = await response.json();
        return {
            status: response.status,
            data: data
        }
    }
    catch (error) {
        console.error('Erro ao buscar serviços:', error);
    }
}

export const fetchSalesSummary = async (startDate, endDate) => {
    const paramsArray = [];
    if (startDate) paramsArray.push(`data_inicial=${startDate}`);
    if (endDate) paramsArray.push(`data_final=${endDate}`);
    const params = paramsArray.join('&');
    try {
        const response = await fetch(`${API_BACK_URL}/documentos-servicos-agrupados/?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
        }});
        const data = await response.json();
        return {
            status: response.status,
            data: data
        }
    }
    catch (error) {
        console.error('Erro ao buscar resumo de vendas:', error);
    }
}

export const fetchSellerCA = async () => {
    try {
        const response = await fetch(`${API_BACK_URL}/conta-azul/sellers/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Token ${sessionStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        return {
            status: response.status,
            data: data
        };
    }
    catch (error) {
        console.error('Error:', error);
    }
}

export const createSeller = async (seller) => {
    try {
        const response = await fetch(`${API_BACK_URL}/vendedores/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Token ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(seller)
        });
        const data = await response.json();
        return {
            status: response.status,
            data: data
        };
    }
    catch (error) {
        console.error('Error:', error);
    }
};

export const fetchSellers = async () => {
    try {
        const response = await fetch(`${API_BACK_URL}/vendedores/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${sessionStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        return {
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error('Error:', error);
    }
}

export const deleteSeller = async (sellerId) => {
    try {
        const response = await fetch(`${API_BACK_URL}/vendedores/${sellerId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Token ${sessionStorage.getItem('token')}`
            }
        });
        return {
            status: response.status
        };
    }
    catch (error) {
        console.error('Error:', error);
    }
}

export const uploadToS3 = async (file, filename) => {
    try {
        const token = sessionStorage.getItem('token');
        const formData = new FormData();
        
        // Adiciona o arquivo ao FormData, 'arquivo' é o nome do campo no servidor
        formData.append('arquivo', file, filename);
        
        const headers = new Headers({
            'Authorization': `Token ${token}` // Não precisa mais definir Content-Type
        });
        
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: formData
        };
        
        const response = await fetch(`${API_BACK_URL}/upload-s3/`, requestOptions);
        const data = await response.json();
        
        return {
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error('Error:', error);
    }
};
