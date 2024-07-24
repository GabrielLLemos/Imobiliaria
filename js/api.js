const url = "http://localhost:3333"

async function searchProperty(queryParams = {}) {
    const response = await axios.get(`${url}/imoveis/search`, {
        params: queryParams // Passa os parâmetros da consulta diretamente para axios
    });
    console.log(response.data)
    // 4. Retorna os dados da resposta da requisição.
    return response.data;
}

//Listar imoveis
async function listProperty(queryParams = {}) {
    // Construir a URL com base nos parâmetros da query string

    // 1. Extrai as chaves do objeto queryParams (parâmetros da query string) 
    //    e cria um array de strings no formato 'chave=valor'.
    const queryString = Object.keys(queryParams)
        .map(key => `${key}=${queryParams[key]}`)
        .join('&');
    
    // 2. Constrói a URL concatenando a string da URL base (url), 
    //    a string '/imoveis' e a string da query string, se existir.
    const urlWithQueryString = `${url}/imoveis${queryString ? `?${queryString}` : ''}`;

    // 3. Realiza uma requisição GET usando a biblioteca axios, 
    //    passando a URL construída e as configurações da requisição (request).
    const response = await axios.get(urlWithQueryString);

    // 4. Retorna os dados da resposta da requisição.
    return response.data;
}

//Cadastrar imoveis
async function createProperty(request) {
    try {
        const response = await axios.post(`${url}/imoveis`, request);

        return response.data
    } catch (error) {
        console.error("Erro na requisição:", error.message);
    }
    return;
}

//Editar imoveis
async function editProperty(id, request) {
    try {
        const response = await axios.put(`${url}/imoveis/${id}`, request);

        return response.data
    } catch (error) {
        console.error("Erro na requisição:", error.message);
    }
    return;
}

//Excluir imoveis
async function deleteProperty(id, request) {
    try {
        const response = await axios.delete(`${url}/imoveis/${id}`, request);

        return response.data
    } catch (error) {
        console.error("Erro na requisição:", error.message);
    }
    return;
}