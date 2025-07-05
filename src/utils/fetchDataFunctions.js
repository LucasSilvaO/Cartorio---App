const fetchFamilies = async (query) => {
    const token = sessionStorage.getItem('token');
    const headers = new Headers({
        'Content-Type': 'application/json', 
        'Authorization': `Token ${token}`
});
    const requestOptions = {
        method: 'GET',
        headers: headers
    };
    const response = await fetch(`http://localhost:8000/familias/?family_name=${query}`, requestOptions);
    const data = await response.json();
    return data;
}

const fetchTranslators = async () => {
    const token = sessionStorage.getItem('token');
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
    });
    const requestOptions = {
        method: 'GET',
        headers: headers
    };
    const response = await fetch(`http://localhost:8000/tradutores/`, requestOptions);
    const data = await response.json();
    return data;
}

const fetchServiceModalities = async () => {
    const token = sessionStorage.getItem('token');
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
    });
    const requestOptions = {
        method: 'GET',
        headers: headers
    };
    const response = await fetch(`http://localhost:8000/modalidades-servicos/`, requestOptions);
    const data = await response.json();
    return data
}

const fetchServices = async (page_size, page) => {
    const token = sessionStorage.getItem('token');
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
    });
    const requestOptions = {
        method: 'GET',
        headers: headers
    };  
    const response = await fetch(`http://localhost:8000/servicos/?page_size=${page_size}&page=${page}`, requestOptions);
    const data = await response.json();
    return data;
}

export { fetchFamilies, fetchTranslators, fetchServiceModalities, fetchServices };