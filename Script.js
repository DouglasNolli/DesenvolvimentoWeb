iniciarSistema();

function iniciarSistema() {
    iniciarRelogio();
    configurarEventos();
}

// FUNCIONALIDADE DO RELÓGIO

function iniciarRelogio() {
    atualizarRelogio();
    setInterval(atualizarRelogio, 1000);
}

function atualizarRelogio() {
    const agora = new Date();
    const data = agora.toLocaleDateString("pt-BR");
    const hora = agora.toLocaleTimeString("pt-BR");

    document.getElementById("relogio").textContent = `${data} ${hora}`;
}

// CRIAÇÃO DAS METAS

function criarMeta(nome, meta, atual, data, hora, mes) {

    const li = document.createElement("li");
    li.setAttribute("data-mes", mes);

    const numeroMeta = document.querySelectorAll("#lista_metas li").length + 1;

    li.innerHTML = `
        <div class="meta-card" style="background:${corFundo(meta, atual)}">
            <div class="meta-info">
                <div class="meta-numero">
                    Meta<br>${String(numeroMeta).padStart(2, '0')}
                </div>

                <div class="divisor"></div>

                <div class="meta-textos">
                    <h5>Nome da meta: ${nome}</h5>
                    <h4 class="meta">Valor da meta estipulado: R$ ${formatarMoeda(meta)}</h4>
                    <h4 class="atual">Valor atingido: R$ ${formatarMoeda(atual)}</h4>
                    <h6>Data e hora da ultima atualização: ${data} | ${hora}</h6>
                </div>
            </div>

            <div class="meta-acoes">
                <button class="btn btn-editar">Editar</button>
                <button class="btn btn-apagar">Apagar</button>
            </div>
        </div>
    `;

    document.getElementById("lista_metas").appendChild(li);
    adicionarEventos(li);
}

// SALVAR META

function salvarMeta() {

    const nome = document.getElementById("nome_meta").value;
    const meta = Number(document.getElementById("meta_definida").value);
    const atual = Number(document.getElementById("valor_atual_meta").value);

    if (!validarCampos(nome, meta, atual)) return;

    const { data, hora, mes } = obterDataAtual();

    if (itemEditando) {
        editarMeta(itemEditando, nome, meta, atual, data, hora, mes);
    } else {
        criarMeta(nome, meta, atual, data, hora, mes);
    }

    limparCampos();
    itemEditando = null;
    atualizarTotais();
}

// PREENCHIMENTO DO FORMULARIO (DADOS JA CADASTRADOS)

function preencherFormulario(li) {

    const nome = li.querySelector(".meta-textos h5").textContent.replace("Nome da meta: ", "");

    let meta = desformatarMoeda(
        li.querySelector(".meta").textContent.replace("Valor da meta estipulado: R$ ", "")
    );

    let atual = desformatarMoeda(
        li.querySelector(".atual").textContent.replace("Valor atingido: R$ ", "")
    );

    document.getElementById("nome_meta").value = nome;
    document.getElementById("meta_definida").value = meta;
    document.getElementById("valor_atual_meta").value = atual;

    itemEditando = li;
}

// EDIÇÃO DA META (CAMPO PARA ALTERAR META JA CADASTRADA)

function editarMeta(li, nome, meta, atual, data, hora, mes) {

    li.querySelector(".meta-textos h5").textContent = `Nome da meta: ${nome}`;
    li.querySelector(".meta").textContent = `Valor da meta estipulado: R$ ${formatarMoeda(meta)}`;
    li.querySelector(".atual").textContent = `Valor atingido: R$ ${formatarMoeda(atual)}`;
    li.querySelector("h6").textContent = `Data e hora da ultima atualização: ${data} | ${hora}`;

    li.querySelector(".meta-card").style.background = corFundo(meta, atual);

    li.setAttribute("data-mes", mes);
}

// ABERTURA DE EVENTOS (SALVAR / FILTRAR)

let itemEditando = null;

function configurarEventos() {
    document.getElementById("salvar_meta").addEventListener("click", salvarMeta);
}

// EVENTOS, BT-APAGAR E BT-EDITAR

function adicionarEventos(li) {

    li.querySelector(".btn-editar").addEventListener("click", () => preencherFormulario(li));

    li.querySelector(".btn-apagar").addEventListener("click", () => {
        li.remove();
        atualizarTotais();
    });
}

// TOTAIS ARRECADADOS E METAS TOTAIS

function atualizarTotais() {

    let totalMeta = 0;
    let totalAtual = 0;
    let totalMais = 0;

    document.querySelectorAll("#lista_metas li").forEach(li => {

        let meta = desformatarMoeda(
            li.querySelector(".meta").textContent.replace("Valor da meta estipulado: R$ ", "")
        );

        let atual = desformatarMoeda(
            li.querySelector(".atual").textContent.replace("Valor atingido: R$ ", "")
        );

        totalMeta += Number(meta);
        totalAtual += Number(atual);
        totalMais += Number(atual - meta);
    });

    document.getElementById("valor_total_meta").textContent = "R$ " + formatarMoeda(totalMeta);
    document.getElementById("valor_total_arrecadado").textContent = "R$ " + formatarMoeda(totalAtual);
    document.getElementById("valor_total_arrecadado_alem_meta").textContent = "R$ " + formatarMoeda(totalMais);
}

// FILTRO DO A-Z

function filtrarPorLetra(letra) {

    const itens = document.querySelectorAll("#lista_metas li");

    itens.forEach(li => {

        const nome = li.querySelector(".meta-textos h5")
            .textContent
            .replace("Nome da meta: ", "")
            .toLowerCase();

        if (letra === "" || nome.startsWith(letra.toLowerCase())) {
            li.style.display = "block";
        } else {
            li.style.display = "none";
        }

    });
}

// FUNÇÕES UTILITARIAS, REUTILIZAVEIS

function validarCampos(nome, meta, atual) {
    if (nome === "" || isNaN(meta) || isNaN(atual)) {
        alert("É necessário preencher todos os campos!");
        return false;
    }
    return true;
}

function obterDataAtual() {
    const agora = new Date();

    return {
        data: agora.toLocaleDateString("pt-BR"),
        hora: agora.toLocaleTimeString("pt-BR"),
        mes: String(agora.getMonth() + 1).padStart(2, '0')
    };
}

function limparCampos() {
    document.getElementById("nome_meta").value = "";
    document.getElementById("meta_definida").value = "";
    document.getElementById("valor_atual_meta").value = "";
}

function corFundo(meta, atual) {
    return atual < meta ? "#FFC8C8" : "#C8FFCC";
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function desformatarMoeda(valor) {
    return valor.replace(/\./g, "").replace(",", ".");
}