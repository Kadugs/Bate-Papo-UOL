const mensagens = [];
const status = [];
const mensagensPv = [];
const URL_MENSAGENS = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages';
const URL_STATUS = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status';
const URL_PARTICIPANTS = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants';
const nomeInserido = prompt('Qual é o seu nome?');
const nome = {name: nomeInserido};
let destinatario = "Todos";
let visibilidade = "message";

function entraServidor() {
    const verificaNome = axios.get(URL_PARTICIPANTS);
    verificaNome.then(funcaoVerificaNome);
    setInterval(recebeMensagens, 3000);
    setInterval(online, 5000, nome);

    const listaDoServer = axios.get(URL_PARTICIPANTS);
    listaDoServer.then(atualizaPessoasOnline);
}
entraServidor();

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
recebeMensagens();

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
        } else if(promise.data[i].type === "private_message" && (promise.data[i].to === nomeInserido || promise.data[i].from === nomeInserido )) {
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

//envia mensagem ao pressionar enter
document.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        enviaMensagem();
    }
});

function enviaMensagem() {
    const mensagemDigitada = document.getElementById('txt').value;
    const paraEnviar = {
        from: nomeInserido,
        to: destinatario,
        text: mensagemDigitada,
        type: visibilidade
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
}

function atualizaPessoasOnline(lista) {
    listaPessoas(lista);
    setInterval(listaPessoas, 10000, lista);
}

function listaPessoas(lista) {
    const pessoasOnline = document.querySelector('.pessoas-online');
    //Reseta os valores anteriores
    pessoasOnline.innerHTML = `<li onclick="selecionaObjeto(this)" class="todos selecionado">
    <div>
        <ion-icon name="people"></ion-icon>
        <span>Todos</span>
        </div>
        <ion-icon name="checkmark-sharp" class="item-selecionado"></ion-icon>
</li>`;

    destinatario = "Todos";
    visibilidade = "message"

    for(let i = 0; i < lista.data.length; i++) {
        if(lista.data[i].name !== nomeInserido) {
            pessoasOnline.innerHTML += `<li onclick="selecionaObjeto(this)">
                <div>
                    <ion-icon name="person-circle"></ion-icon>
                    <span> ${lista.data[i].name}</span>
                    </div>
                    <ion-icon name="checkmark-sharp" class="item-selecionado escondido"></ion-icon>
            </li>`
        }
    }
}

function ocultaLateral() {
    const menu = document.querySelector('.container-menu-lateral');
    menu.style.display = 'none';
}

// SELEÇÃO DO MENU LATERAL

function alteraSelecao(selecionado, pai) {
    const anteriorSelecionado = pai.querySelector(".selecionado");
    if(anteriorSelecionado === selecionado) {
        return;
    } else {
        selecionado.classList.add('selecionado');
        anteriorSelecionado.classList.remove('selecionado');
        selecionado.querySelector(".item-selecionado").classList.remove('escondido');
        anteriorSelecionado.querySelector(".item-selecionado").classList.add('escondido');
    }  
}
function selecionaObjeto(objeto) {
    const pessoasOnline = document.querySelector('.pessoas-online');
    const visibilidadeEscolhida = document.querySelector('.visibilidade');

    if(objeto.parentNode === pessoasOnline) {
        alteraSelecao(objeto, pessoasOnline);
        destinatario = objeto.querySelector('span').innerHTML;
        
    } else if(objeto.parentNode === visibilidadeEscolhida) {
        alteraSelecao(objeto, visibilidadeEscolhida);
        visibilidade = objeto.querySelector('span').classList.item(0);
    }
}