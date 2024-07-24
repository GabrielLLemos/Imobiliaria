//Pegando dos Dados na Memória do Navegador
function loadData () {
    const dadosString = localStorage.getItem("dados");
    let dados = dadosString != "undefined" && dadosString ? JSON.parse(dadosString) : [];
    return dados;
}

//Salvando os dados na Mémória do Navegador
function saveData (dados) {
    localStorage.setItem("dados", JSON.stringify(dados));
}

//Gera o HTML do Card com o Imóvel
function generateCardProp(prop){
    console.log(prop)
    const {id, title, type, price, description, roomCount: room_count, bathCount: bath_count} =  prop;

    return `
        <div class="imoveis-info">
            <div class="picture">

            </div>

            <div class="imovel-desc-size">
                <div class="imovel-desc">
                    <div class="imovel-nome-valor">
                        <div>
                            <h4 id="nome_imovel">${title}</h6>
                            <p id="valor">R$ ${price}</p>
                        </div>
                        <div class="status">
                            <label id="modalidade">${type}</label>
                        </div>
                    </div>
                    
                    <div class="imovel-desc-label">
                        <p id="imovel_desc">${description}</p>
                    </div>
                </div>
            </div>

            <div class="imovel-icons">
                <img src="images/bed-solid 1.png" alt="Quartos">
                <p id="numero_de_quartos">${room_count}</p>
                <img src="images/bath-solid 1.png" alt="Banheiros">
                <p id="numero_de_banheiros">${bath_count}</p>
            </div>

            <div class="details">
                <button id="editar" onclick="btnOpenEditModal(${id})">Editar</button>
                <button id="btnDelete" onclick="btnDelete(${id})">Excluir</button>
                <button id="detalhes" onclick="showPropertyDetails(${id})">Detalhes</button>
            </div>
        </div>
    `;
}

//Carrega as informações na tela inicial
async function loadMainScreen() {
    const dados = await listProperty()
    saveData(dados);
    console.log(dados)

    const html = dados.length > 0 ? dados.map(index => generateCardProp(index)).join("") : "Nenhum imovel encontrado";

    document.getElementById("imoveis_html").innerHTML = html;
}

// Busca por imóvel
function searchScreen(dataType) {
    const dados = loadData()

    html = data.length > 0 ? dataType.map(index => generateCardProp(index)).join("") : "Nenhum imovel encontrado"

    document.getElementById("imoveis_html").innerHTML = html
}

// Abre o modal e personaliza ele de acordo com o tipo de modal
function btnOpenRegisterModal() {
    //Definindo Titulo do Formulário
    document.getElementById("btn-form").textContent = "Cadastrar";
    document.getElementById("btn-form").value = "cadastrar"
    //Definindo Botão do Formulário
    document.getElementById("title-form").textContent = "Cadastrar Imovel";

    document.getElementById("new_title").value = ""
    document.getElementById("new_price").value = ""
    document.getElementById("new_modalidade").value = ""
    document.getElementById("new_desc").value = ""
    document.getElementById("new_room").value = ""
    document.getElementById("new_bath").value = ""
    
    showModal();
}

function btnOpenEditModal(id) {
     //Definindo Titulo do Formulário
     const btnSubmit = document.getElementById("btn-form");

     btnSubmit.textContent = "Editar";
     btnSubmit.value = "editar"
     
     btnSubmit.setAttribute('data-id', id);
     //Definindo Botão do Formulário
     document.getElementById("title-form").textContent = "Editar Imovel";
 
     //POPULAR FORMULÁRIO
     const dados = loadData();

     const dado = dados.find(index => index.id == id);

    document.getElementById("new_title").value = dado.title
    document.getElementById("new_price").value = dado.price
    document.getElementById("new_modalidade").value = dado.type
    document.getElementById("new_desc").value = dado.description
    document.getElementById("new_room").value = dado.roomCount
    document.getElementById("new_bath").value = dado.bathCount

    showModal()
}

function showPropertyDetails() {
    console.log("Detalhes")
}

//On load event
document.addEventListener('DOMContentLoaded', () => {
    loadMainScreen();
})

//Ao clicar no botão de cadastrar ou editar
document.getElementById("btn-form").addEventListener('click', () => {
    const btnForm = document.getElementById("btn-form");
    const id = btnForm.getAttribute('data-id');
    const typeForm = btnForm.value;

    saveInDatabase(typeForm, id)
})

//DELETAR IMOVEL
async function btnDelete(id) {
    const result = loadData()

    const dataDelete = result.find(index => index.id == id);
    const response = await deleteProperty(id, dataDelete)

    saveData(response)

    loadMainScreen()
}

//Filtro de modalidade
document.getElementById("modalidade").addEventListener('onChange', () => {
    const dados = loadData()
    const option = document.getElementById("modalidade")

    let dataType = dados.filter(index => index.type.toLowerCase() == option.value.toLowerCase());
    console.log(dataType)
    
    if(dataType.length > 0) {
        searchScreen(dataType)
        saveData()
    }else{
        saveData()
        loadMainScreen()
    }
})

//Pesquisar Imóveis
async function btnSearchInfo() {
    const searchTitle = document.getElementById("local").value
    const selectType = document.getElementById("modalidade").value
    
    const dados = await searchProperty({title: searchTitle, type: selectType})
    console.log(dados)
    saveData(dados)
    //window.location.reload();
    const html = dados.length > 0 ? dados.map(index => generateCardProp(index)).join("") : "Nenhum imovel encontrado";

    document.getElementById("imoveis_html").innerHTML = html;
}

//Fechar Modal
function btnCloseModal () {
    const close_btn = document.getElementById("janela-modal")
    close_btn.classList.toggle("abrir")
}

// Exibe modal Cadastrar/Editar
function showModal() {
    const modal = document.getElementById('janela-modal')
    modal.classList.add('abrir')
}

//Metodo salva imoveis no banco de dados.
async function saveInDatabase(typeForm, id=null) {
    let title = document.getElementById("new_title").value
    let price = document.getElementById("new_price").value
    let type = document.getElementById("new_modalidade").value
    let description = document.getElementById("new_desc").value
    let roomCount = document.getElementById("new_room").value
    let bathCount = document.getElementById("new_bath").value

    const data = {
        title,
        price,
        type,
        description,
        roomCount,
        bathCount
    }

    if(typeForm == "cadastrar"){
        const response = await createProperty(data);

        let result = loadData();
        result.push(response);
        saveData(result);

        loadMainScreen()
    } else {
        // Implementar a integração com o mpetodo editPropertie
        const response = await editProperty(id, data)
        
        saveData(response)
        loadMainScreen()
    }



    btnCloseModal ()
    //load()
}