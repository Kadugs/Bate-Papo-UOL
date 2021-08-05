const mensagens = [];
const status = [];
const URL_MENSAGENS = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages';
const URL_STATUS = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status';
const URL_PARTICIPANTS = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants';
const nomeInserido = "Cadu";
const nome = {name: nomeInserido};

entraServidor();
recebeMensagens();
function entraServidor() {
    const verificaNome = axios.get(URL_PARTICIPANTS);
    verificaNome.then(funcaoVerificaNome);
    setInterval(recebeMensagens, 3000);
    setInterval(online, 5000, nome);
}

function funcaoVerificaNome(promise) {
    for(let i = 0; i < promise.data.length; i++) {
        //Esse if evita dar erros em caso de f5 na página
        if(promise.data[i].name === nomeInserido) {
            return;
        } 
    }
    axios.post(URL_PARTICIPANTS, nome);
}

function online(nome) {
    axios.post(URL_STATUS, nome);
}

function recebeMensagens() {
    const promiseMensagens = axios.get(URL_MENSAGENS);
    promiseMensagens.then(atualizaMensagens);
}

const ul = document.querySelector(".lista-mensagens");

function atualizaMensagens(promise) {
    ul.innerHTML = "";
    let msgs = 0;
    let sts = 0;
    for(let i = 0; i < promise.data.length; i++) {
        if(promise.data[i].type === "message") {
            mensagens[msgs] = promise.data[i];
            adicionaMensagemDOM(msgs);
            msgs++;
        } else if(promise.data[i].type === "status") {
            status[sts] = promise.data[i];
            adicionaStatusDOM(sts);
            sts++;
        }
    }
    
    const ultimoElemento = document.querySelector("li:last-child");
    ultimoElemento.scrollIntoView(true);

    function adicionaMensagemDOM(valor) {
        ul.innerHTML += `<li class="mensagem"> <span class="hora-msg">(${mensagens[valor].time})</span><strong class="pessoa-msg">${mensagens[valor].from} </strong>
        para <strong class="pessoa-msg">${mensagens[valor].to}</strong>: <span class="texto-msg">${mensagens[valor].text} </span> </li>`;
        // console.log(mensagens[valor]);
    }

    function adicionaStatusDOM(valor) {
        ul.innerHTML += `<li class="status"> <span class="hora-msg">(${status[valor].time})</span><strong class="pessoa-msg">${status[valor].from} </strong>
        <span class="texto-msg">${status[valor].text} </span></li>`;
    }
}

function enviaMensagem() {
    const mensagemDigitada = document.getElementById('txt').value;
    const paraEnviar = {
        from: nomeInserido,
        to: "Todos",
        text: mensagemDigitada,
        type: "message"
    }
    if(mensagemDigitada !== '') {
        const promiseEnviar = axios.post(URL_MENSAGENS, paraEnviar);
        promiseEnviar.then(recebeMensagens);
    }
    document.getElementById('txt').value = '';
}