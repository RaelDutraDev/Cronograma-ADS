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

const elementoData=document.getElementById("InforData");
const elementoDiaSemana=document.getElementById("diaSemana");
const listaAulas=document.getElementById("listaAulas");
const elementoSemAulas=document.getElementById("semAulas");
const mensagemFinal=document.getElementById("mensagemFinal");
const contadorAulas=document.getElementById("contadorAulas");

function descobrirDiaSemana(data){
    const dias={
        0:{chave:"domingo",nome:"Domingo"},
        1:{chave:"segunda",nome:"Segunda-feira"},
        2:{chave:"terca",nome:"Terça-feira"},
        3:{chave:"quarta",nome:"Quarta-feira"},
        4:{chave:"quinta",nome:"Quinta-feira"},
        5:{chave:"sexta",nome:"Sexta-feira"},
        6:{chave:"sabado",nome:"Sábado"}
    };
    return dias[data.getUTCDay()];
}

function obterDataBrasilia(){
    const agora=new Date();
    const partes=new Intl.DateTimeFormat("pt-BR",{
        timeZone:"America/Sao_Paulo",
        year:"numeric",
        month:"2-digit",
        day:"2-digit"
    }).formatToParts(agora);

    let dia="";
    let mes="";
    let ano="";

    for(const parte of partes){
        if(parte.type==="day")dia=parte.value;
        if(parte.type==="month")mes=parte.value;
        if(parte.type==="year")ano=parte.value;
    }

    const data=new Date(Date.UTC(Number(ano),Number(mes)-1,Number(dia),12));

    return{dia,mes,ano,data};
}

function obterHorarioBrasilia(){
    const agora=new Date();
    const partes=new Intl.DateTimeFormat("pt-BR",{
        timeZone:"America/Sao_Paulo",
        hour:"2-digit",
        minute:"2-digit",
        hour12:false
    }).formatToParts(agora);

    let hora=0;
    let minuto=0;

    for(const parte of partes){
        if(parte.type==="hour")hora=Number(parte.value);
        if(parte.type==="minute")minuto=Number(parte.value);
    }

    return{hora,minuto};
}

function horarioEmMinutos(horario){
    const [hora,minuto]=horario.split(":").map(Number);
    return hora*60+minuto;
}

function descobrirStatus(aula){
    const horarioAtual=obterHorarioBrasilia();
    const agoraEmMinutos=horarioAtual.hora*60+horarioAtual.minuto;
    const inicio=horarioEmMinutos(aula.inicio);
    const fim=horarioEmMinutos(aula.fim);

    if(agoraEmMinutos<inicio){
        return{
            classe:"proxima",
            textoIndicador:"Próxima",
            textoStatus:`Começa às ${aula.inicio}`
        };
    }

    if(agoraEmMinutos>=inicio&&agoraEmMinutos<fim){
        return{
            classe:"em-andamento",
            textoIndicador:"Em aula",
            textoStatus:"Aula acontecendo agora"
        };
    }

    return{
        classe:"encerrada",
        textoIndicador:"Encerrada",
        textoStatus:`Terminou às ${aula.fim}`
    };
}

function criarBlocoAula(aula){
    const status=descobrirStatus(aula);
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

    adicionarArraste(bloco);

    return bloco;
}

function carregarCronograma(){
    listaAulas.innerHTML="";

    const informacoesData=obterDataBrasilia();
    const informacoesDia=descobrirDiaSemana(informacoesData.data);
    const aulasDoDia=cronograma[informacoesDia.chave]||[];

    elementoData.textContent=`${informacoesData.dia}/${informacoesData.mes}/${informacoesData.ano.slice(-2)}`;
    elementoDiaSemana.textContent=informacoesDia.nome;
    contadorAulas.textContent=`${aulasDoDia.length} ${aulasDoDia.length===1?"aula":"aulas"}`;

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
        listaAulas.appendChild(criarBlocoAula(aula));
    });
}

function atualizarStatusDasAulas(){
    const blocos=document.querySelectorAll(".aula");
    const agora=obterDataBrasilia();
    const informacoesDia=descobrirDiaSemana(agora.data);
    const aulasDoDia=cronograma[informacoesDia.chave]||[];

    blocos.forEach((bloco,index)=>{
        const aula=aulasDoDia[index];
        if(!aula)return;

        const status=descobrirStatus(aula);

        bloco.classList.remove("proxima","em-andamento","encerrada");
        bloco.classList.add(status.classe);

        const textoIndicador=bloco.querySelector(".indicador span:last-child");
        const statusTexto=bloco.querySelector(".status-texto");

        if(textoIndicador)textoIndicador.textContent=status.textoIndicador;
        if(statusTexto)statusTexto.textContent=status.textoStatus;
    });
}

function adicionarArraste(elemento){
    let inicioX=0;
    let movimentoX=0;
    let arrastando=false;
    const LIMITE=75;

    elemento.addEventListener("pointerdown",evento=>{
        arrastando=true;
        inicioX=evento.clientX;
        movimentoX=0;
        elemento.setPointerCapture(evento.pointerId);
        elemento.classList.add("arrastando");
    });

    elemento.addEventListener("pointermove",evento=>{
        if(!arrastando)return;

        movimentoX=evento.clientX-inicioX;

        if(movimentoX>LIMITE)movimentoX=LIMITE;
        if(movimentoX<-LIMITE)movimentoX=-LIMITE;

        elemento.style.transform=`translateX(${movimentoX}px)`;
    });

    function finalizarArraste(){
        if(!arrastando)return;
        arrastando=false;
        elemento.classList.remove("arrastando");
        elemento.style.transform="translateX(0)";
    }

    elemento.addEventListener("pointerup",finalizarArraste);
    elemento.addEventListener("pointercancel",finalizarArraste);
    elemento.addEventListener("lostpointercapture",finalizarArraste);
}

carregarCronograma();
setInterval(atualizarStatusDasAulas,30000);
setInterval(carregarCronograma,60000);