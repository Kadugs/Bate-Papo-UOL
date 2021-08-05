const mensagens = [];
const status = [];
const mensagensPv = [];
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
    promiseMensagens.catch(trataErros);
}


function atualizaMensagens(promise) {
    const ul = document.querySelector(".lista-mensagens");
    ul.innerHTML = "";
    let msgs = 0;
    let sts = 0;
    let pv = 0;
    for(let i = 0; i < promise.data.length; i++) {
        if(promise.data[i].type === "message") {
            mensagens[msgs] = promise.data[i];
            adicionaMensagemDOM(msgs);
            msgs++;
        } else if(promise.data[i].type === "status") {
            status[sts] = promise.data[i];
            adicionaStatusDOM(sts);
            sts++;
        } else if(promise.data[i].type === "private_message" && promise.data[i].to === nomeInserido) {
            mensagensPv[pv] = promise.data[i];
            adicionaPvDOM(pv);
            pv++;
        }
    }
    
    const ultimoElemento = document.querySelector("li:last-child");
    ultimoElemento.scrollIntoView(true);

    function adicionaMensagemDOM(valor) {
        ul.innerHTML += `<li class="mensagem"> <span class="hora-msg">(${mensagens[valor].time})</span><strong class="pessoa-msg">${mensagens[valor].from} </strong>
        para <strong class="pessoa-msg">${mensagens[valor].to}</strong>: <span class="texto-msg">${mensagens[valor].text} </span> </li>`;
    }

    function adicionaStatusDOM(valor) {
        ul.innerHTML += `<li class="status"> <span class="hora-msg">(${status[valor].time})</span><strong class="pessoa-msg">${status[valor].from} </strong>
        <span class="texto-msg">${status[valor].text} </span></li>`;
    }

    function adicionaPvDOM(valor) {
        ul.innerHTML += `<li class="mensagem-pv"> <span class="hora-msg">(${mensagensPv[valor].time})</span><strong class="pessoa-msg">${mensagensPv[valor].from} </strong>
        reservadamente para <strong class="pessoa-msg">${mensagensPv[valor].to}</strong>: <span class="texto-msg">${mensagensPv[valor].text} </span> </li>`;
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
    //caso nao haja mensagem, não enviará nada
    if(mensagemDigitada !== '') {
        const promiseEnviar = axios.post(URL_MENSAGENS, paraEnviar);
        promiseEnviar.then(recebeMensagens);
        promiseEnviar.catch(trataErros);
    }
    document.getElementById('txt').value = '';
}

function trataErros(error) {
    console.log(error.response.data);
}

function revelaMenuOnline() {
    const menu = document.querySelector('.container-menu-lateral');
    menu.style.display = 'flex';
    const listaDoServer = axios.get(URL_PARTICIPANTS);
    listaDoServer.then(listaPessoas);
}

function listaPessoas(lista) {
    const pessoasOnline = document.querySelector('.pessoas-online');
    //Reseta os valores anteriores
    pessoasOnline.innerHTML = `<li class="todos">
    <ion-icon name="people"></ion-icon>
    <span>Todos</span>
</li>`;
    for(let i = 0; i < lista.data.length; i++) {
        if(lista.data[i].name !== nomeInserido) {
            pessoasOnline.innerHTML += `<li>
                <ion-icon name="person-circle"></ion-icon>
                <span> ${lista.data[i].name}</span>
            </li>`
        }
    }
}

function ocultaLateral() {
    const menu = document.querySelector('.container-menu-lateral');
    menu.style.display = 'none';
}