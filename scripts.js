const mensagens = [];
const promiseMensagens = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages');

function entraServidor() {
    const nome = {name: "cadu"};
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants', nome);
    setInterval(online, 5000, nome);
    promiseMensagens.then(recebeMensagens);
}
entraServidor();


function online(nome) {
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status', nome);
}

function recebeMensagens(promise) {
    let msgs = 0;
    console.log(promise.data)
    for(let i = 0; i < 100; i++) {
        if(promise.data[i].type === "message" && promise.data[i].to === "Todos") {
            mensagens[msgs] = promise.data[i];
            adicionaDOM();
            msgs++;
        }
    }
}
function adicionaDOM() {
    const ul = document.querySelector(".lista-mensagens");
    for(i = 0; i < mensagens.length; i++) {
        ul.innerHTML += `<li> <span class="hora-msg">(${mensagens[i].time})</span><strong class="pessoa-msg">${mensagens[i].from} </strong>
        para <strong class="pessoa-msg">${mensagens[i].from}</strong>: <span class="texto-msg">${mensagens[i].text} </span> </li>`;
    }
} 

function enviaMensagem() {
    // const paraEnviar = {
    //     from: "Cadu",
    //     to: "Todos",
    //     text: "olá olá",
    //     type: "message"
    // }
    // axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages', paraEnviar);
}