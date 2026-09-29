const cronograma={
segunda:[
{materia:"Inglês Técnico 2",professor:"Elielson",inicio:"07:15",fim:"09:15"},
{materia:"Interação Humano Computador",professor:"Roney",inicio:"09:30",fim:"11:30"}
],
terca:[
{materia:"Ambiente de Desenvolvimento de Software",professor:"Roney",inicio:"07:15",fim:"09:15"},
{materia:"Programação Estruturada",professor:"Rafael",inicio:"09:30",fim:"11:30"}
],
quarta:[
{materia:"Programação Estruturada",professor:"Rafael",inicio:"07:15",fim:"09:15"},
{materia:"Engenharia de Software",professor:"Rafael",inicio:"09:30",fim:"11:30"}
],
quinta:[
{materia:"Segurança da Informação",professor:"Jefté",inicio:"07:15",fim:"09:15"},
{materia:"Sistemas Operacionais",professor:"Jardel",inicio:"09:30",fim:"11:30"}
],
sexta:[
{materia:"Banco de Dados",professor:"Jardel",inicio:"07:15",fim:"09:15"},
{materia:"Banco de Dados",professor:"Jardel",inicio:"09:30",fim:"11:30"}
]
};

const painelPrincipal=document.querySelector(".MenuPrincipal");
const cabecalhoData=document.querySelector(".Data");
const elementoData=document.getElementById("InforData");
const elementoDiaSemana=document.getElementById("diaSemana");
const periodoData=document.getElementById("periodoData");
const tituloDia=document.getElementById("tituloDia");
const contadorAulas=document.getElementById("contadorAulas");
const listaAulas=document.getElementById("listaAulas");
const elementoSemAulas=document.getElementById("semAulas");
const mensagemFinal=document.getElementById("mensagemFinal");
const botaoAnterior=document.getElementById("botaoAnterior");
const botaoProximo=document.getElementById("botaoProximo");
const botaoHoje=document.getElementById("botaoHoje"); // Novo botão

let deslocamento=0;

function obterDataBrasilia(){
    const partes=new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
    let dia="",mes="",ano="";
    for(const parte of partes){
        if(parte.type==="day")dia=parte.value;
        if(parte.type==="month")mes=parte.value;
        if(parte.type==="year")ano=parte.value;
    }
    return new Date(Date.UTC(Number(ano),Number(mes)-1,Number(dia),12));
}

function adicionarDias(data,quantidade){
    const novaData=new Date(data);
    novaData.setUTCDate(novaData.getUTCDate()+quantidade);
    return novaData;
}

function descobrirDiaSemana(data){
    const dias=[
        {chave:"domingo",nome:"Domingo"},{chave:"segunda",nome:"Segunda-feira"},{chave:"terca",nome:"Terça-feira"},
        {chave:"quarta",nome:"Quarta-feira"},{chave:"quinta",nome:"Quinta-feira"},{chave:"sexta",nome:"Sexta-feira"},{chave:"sabado",nome:"Sábado"}
    ];
    return dias[data.getUTCDay()];
}

function formatarData(data){
    const dia=String(data.getUTCDate()).padStart(2,"0");
    const mes=String(data.getUTCMonth()+1).padStart(2,"0");
    const ano=String(data.getUTCFullYear()).slice(-2);
    return `${dia}/${mes}/${ano}`;
}

function horarioEmMinutos(horario){
    const [hora,minuto]=horario.split(":").map(Number);
    return hora*60+minuto;
}

function obterHorarioBrasilia(){
    const partes=new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());
    let hora=0,minuto=0;
    for(const parte of partes){
        if(parte.type==="hour")hora=Number(parte.value);
        if(parte.type==="minute")minuto=Number(parte.value);
    }
    return hora*60+minuto;
}

function descobrirStatus(aula,dataExibida){
    const hoje=obterDataBrasilia();
    const diferenca=dataExibida.getTime()-hoje.getTime();
    if(diferenca<0) return{classe:"encerrada",textoIndicador:"Encerrada",textoStatus:`Terminou às ${aula.fim}`};
    if(diferenca>0) return{classe:"proxima",textoIndicador:"Próxima",textoStatus:`Começa às ${aula.inicio}`};
    const agora=obterHorarioBrasilia();
    const inicio=horarioEmMinutos(aula.inicio);
    const fim=horarioEmMinutos(aula.fim);
    if(agora<inicio) return{classe:"proxima",textoIndicador:"Próxima",textoStatus:`Começa às ${aula.inicio}`};
    if(agora>=inicio&&agora<fim) return{classe:"em-andamento",textoIndicador:"Em aula",textoStatus:"Aula acontecendo agora"};
    return{classe:"encerrada",textoIndicador:"Encerrada",textoStatus:`Terminou às ${aula.fim}`};
}

// Lógica de transparência com base na proximidade e no deslocamento de dias
function definirOpacidade(bloco,classe){
    let opacidade=0.85; // Base forte para hoje

    if(deslocamento===0){
        if(classe==="em-andamento"){
            opacidade=1; // Destaque total apenas na aula acontecendo agora
        }else{
            opacidade=0.85; // Uniforme para as outras aulas de hoje (encerradas ou próximas)
        }
    }else{
        // Decai apenas 0.04 por dia de distância. Limite mínimo de 0.20 para não sumir do nada.
        const decaimento=Math.abs(deslocamento)*0.04;
        opacidade=Math.max(0.20,0.85-decaimento);
    }

    bloco.style.opacity=opacidade;
}

function criarBlocoAula(aula,dataExibida){
    const status=descobrirStatus(aula,dataExibida);
    const bloco=document.createElement("div");
    const topo=document.createElement("div");
    const materia=document.createElement("div");
    const indicador=document.createElement("div");
    const ponto=document.createElement("span");
    const textoIndicador=document.createElement("span");
    const professor=document.createElement("div");
    const horario=document.createElement("div");
    const horarioTexto=document.createElement("span");
    const statusTexto=document.createElement("span");

    bloco.classList.add("aula",status.classe);
    
    // Adiciona o brilho do vidro SOMENTE se for HOJE
    if(deslocamento === 0) {
        bloco.classList.add("brilho-hoje");
    }

    topo.classList.add("aula-topo");
    materia.classList.add("materia");
    indicador.classList.add("indicador");
    ponto.classList.add("indicador-ponto");
    professor.classList.add("professor");
    horario.classList.add("horario");
    horarioTexto.classList.add("horario-texto");
    statusTexto.classList.add("status-texto");

    materia.textContent=aula.materia;
    textoIndicador.textContent=status.textoIndicador;
    professor.textContent=`Professor: ${aula.professor}`;
    horarioTexto.textContent=`${aula.inicio} — ${aula.fim}`;
    statusTexto.textContent=status.textoStatus;

    indicador.appendChild(ponto);
    indicador.appendChild(textoIndicador);
    topo.appendChild(materia);
    topo.appendChild(indicador);
    horario.appendChild(horarioTexto);
    horario.appendChild(statusTexto);
    bloco.appendChild(topo);
    bloco.appendChild(professor);
    bloco.appendChild(horario);

    definirOpacidade(bloco,status.classe);
    adicionarArraste(bloco);
    return bloco;
}

function atualizarPeriodo(){
    if(deslocamento===0){
        periodoData.textContent="HOJE";
        tituloDia.textContent="Aulas de hoje";
        mensagemFinal.textContent="Aproveite o restante do dia!";
        return;
    }
    if(deslocamento===-1){
        periodoData.textContent="ONTEM";
        tituloDia.textContent="Aulas de ontem";
        mensagemFinal.textContent="Esse dia já foi encerrado.";
        return;
    }
    if(deslocamento===1){
        periodoData.textContent="AMANHÃ";
        tituloDia.textContent="Aulas de amanhã";
        mensagemFinal.textContent="Confira suas próximas aulas.";
        return;
    }
    if(deslocamento<0){
        periodoData.textContent="ANTERIOR";
        tituloDia.textContent="Aulas anteriores";
        mensagemFinal.textContent="Esse dia já foi encerrado.";
        return;
    }
    periodoData.textContent="PRÓXIMO";
    tituloDia.textContent="Aulas futuras";
    mensagemFinal.textContent="Confira suas próximas aulas.";
}

function carregarCronograma(){
    listaAulas.innerHTML="";
    const hoje=obterDataBrasilia();
    const dataExibida=adicionarDias(hoje,deslocamento);
    const informacoesDia=descobrirDiaSemana(dataExibida);
    const aulasDoDia=cronograma[informacoesDia.chave]||[];

    elementoData.textContent=formatarData(dataExibida);
    elementoDiaSemana.textContent=informacoesDia.nome;
    contadorAulas.textContent=`${aulasDoDia.length} ${aulasDoDia.length===1?"aula":"aulas"}`;

    atualizarPeriodo();
    
    // Liga ou desliga as luzes (Glow) baseado no dia atual
    if(deslocamento === 0){
        cabecalhoData.classList.add("glow-hoje");
        painelPrincipal.classList.add("glow-hoje");
        botaoHoje.hidden = true;
    } else {
        cabecalhoData.classList.remove("glow-hoje");
        painelPrincipal.classList.remove("glow-hoje");
        botaoHoje.hidden = false;
    }

    if(aulasDoDia.length===0){
        listaAulas.style.display="none";
        elementoSemAulas.hidden=false;
        mensagemFinal.hidden=true;
        return;
    }

    listaAulas.style.display="flex";
    elementoSemAulas.hidden=true;
    mensagemFinal.hidden=false;

    aulasDoDia.forEach(aula=>{
        listaAulas.appendChild(criarBlocoAula(aula,dataExibida));
    });

    listaAulas.scrollTop=0;
}

function atualizarStatusDasAulas(){
    if(deslocamento!==0) return;
    const blocos=document.querySelectorAll(".aula");
    const hoje=obterDataBrasilia();
    const informacoesDia=descobrirDiaSemana(hoje);
    const aulasDoDia=cronograma[informacoesDia.chave]||[];

    blocos.forEach((bloco,index)=>{
        const aula=aulasDoDia[index];
        if(!aula) return;
        const status=descobrirStatus(aula,hoje);
        bloco.classList.remove("proxima","em-andamento","encerrada");
        bloco.classList.add(status.classe);
        
        definirOpacidade(bloco,status.classe);

        const textoIndicador=bloco.querySelector(".indicador span:last-child");
        const statusTexto=bloco.querySelector(".status-texto");
        if(textoIndicador) textoIndicador.textContent=status.textoIndicador;
        if(statusTexto) statusTexto.textContent=status.textoStatus;
    });
}

function adicionarArraste(elemento){
    let inicioX=0, movimentoX=0, arrastando=false;
    const LIMITE=75;

    elemento.addEventListener("pointerdown",evento=>{
        arrastando=true;
        inicioX=evento.clientX;
        movimentoX=0;
        elemento.setPointerCapture(evento.pointerId);
        // Aplica o efeito de "afundar" o cartão
        elemento.classList.add("arrastando", "pressionada");
    });

    elemento.addEventListener("pointermove",evento=>{
        if(!arrastando) return;
        movimentoX=evento.clientX-inicioX;
        
        // Se o usuário começar a arrastar de verdade (mais de 3px), removemos o efeito "pressionada"
        // para que o arraste flua visualmente com o tamanho normal do cartão.
        if(Math.abs(movimentoX) > 3) elemento.classList.remove("pressionada");

        if(movimentoX>LIMITE) movimentoX=LIMITE;
        if(movimentoX<-LIMITE) movimentoX=-LIMITE;
        elemento.style.transform=`translateX(${movimentoX}px)`;
    });

    function finalizarArraste(){
        if(!arrastando) return;
        arrastando=false;
        elemento.classList.remove("arrastando", "pressionada");
        elemento.style.transform="translateX(0)";
    }

    elemento.addEventListener("pointerup",finalizarArraste);
    elemento.addEventListener("pointercancel",finalizarArraste);
    elemento.addEventListener("lostpointercapture",finalizarArraste);
}

botaoAnterior.addEventListener("click",()=>{ deslocamento--; carregarCronograma(); });
botaoProximo.addEventListener("click",()=>{ deslocamento++; carregarCronograma(); });
botaoHoje.addEventListener("click",()=>{ deslocamento=0; carregarCronograma(); });

carregarCronograma();

setInterval(atualizarStatusDasAulas,30000);
setInterval(carregarCronograma,60000);