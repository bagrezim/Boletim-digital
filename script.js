// CONFIGURAÇÃO FIXA DO ALUNO
const CONFIG_ALUNO = {
  turma: "8B",
  numeroChamada: 12,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// DADOS FICTÍCIOS PADRONIZADOS — 8º ANO (RESERVA LOCAL / PADRÃO)
let dadosBoletim = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// VARIÁVEL DE SESSÃO EM MEMÓRIA PARA O PIN
let pinSessao = "";

// FUNÇÃO PARA NORMALIZAR NOTAS ANTIGAS / LOCAIS
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  let num = parseFloat(String(valor).replace(",", "."));
  if (isNaN(num)) return null;

  if (num >= 0 && num <= 10) {
    return num;
  }
  if (num > 10 && num <= 100) {
    return num / 10;
  }
  return null;
}

// FORMATAR EXIBIÇÃO DE NOTAS
function formatarExibicaoNota(valor) {
  const norm = normalizarNota(valor);
  return norm !== null ? norm.toFixed(1).replace(".", ",") : "Ainda não lançada";
}

// RENDERIZAR TABELA E CARDS
function renderizarBoletim() {
  const tabelaCorpo = document.getElementById("tabela-corpo");
  tabelaCorpo.innerHTML = "";

  let somaMediasGerais = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let bomDesempenhoQtd = 0;
  let atencaoQtd = 0;

  dadosBoletim.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const notasValidas = [n1, n2, n3].filter((n) => n !== null);
    
    let mediaTexto = "—";
    let situacao = "Nota ainda não disponível";
    let classeStatus = "status-indisponivel";

    if (notasValidas.length > 0) {
      const somaNotas = notasValidas.reduce((acc, curr) => acc + curr, 0);
      const media = somaNotas / notasValidas.length;
      mediaTexto = media.toFixed(1).replace(".", ",");

      somaMediasGerais += media;
      qtdDisciplinasComMedia++;

      if (media >= 6.0) {
        situacao = "Bom desempenho";
        classeStatus = "status-bom";
        bomDesempenhoQtd++;
      } else {
        situacao = "Atenção";
        classeStatus = "status-atencao";
        atencaoQtd++;
      }
    }

    const arrFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const totalFaltasDisciplina = arrFaltas.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    totalFaltasGeral += totalFaltasDisciplina;

    const linha = document.createElement("tr");

    const tdDisc = document.createElement("td");
    const strongDisc = document.createElement("strong");
    strongDisc.textContent = item.disciplina || "";
    tdDisc.appendChild(strongDisc);
    linha.appendChild(tdDisc);

    const td1 = document.createElement("td");
    td1.textContent = formatarExibicaoNota(item.tri1);
    linha.appendChild(td1);

    const td2 = document.createElement("td");
    td2.textContent = formatarExibicaoNota(item.tri2);
    linha.appendChild(td2);

    const td3 = document.createElement("td");
    td3.textContent = formatarExibicaoNota(item.tri3);
    linha.appendChild(td3);

    const tdMedia = document.createElement("td");
    const strongMedia = document.createElement("strong");
    strongMedia.textContent = mediaTexto;
    tdMedia.appendChild(strongMedia);
    linha.appendChild(tdMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = String(totalFaltasDisciplina);
    linha.appendChild(tdFaltas);

    const tdSit = document.createElement("td");
    const spanSit = document.createElement("span");
    spanSit.className = `status ${classeStatus}`;
    spanSit.textContent = situacao;
    tdSit.appendChild(spanSit);
    linha.appendChild(tdSit);

    tabelaCorpo.appendChild(linha);
  });

  const mediaGeralFinal = qtdDisciplinasComMedia > 0 
    ? (somaMediasGerais / qtdDisciplinasComMedia).toFixed(1).replace(".", ",") 
    : "—";

  document.getElementById("media-geral").textContent = mediaGeralFinal;
  document.getElementById("total-faltas").textContent = String(totalFaltasGeral);
  document.getElementById("qtd-bom-desempenho").textContent = String(bomDesempenhoQtd);
  document.getElementById("qtd-atencao").textContent = String(atencaoQtd);
}

// AUTENTICAÇÃO / ABRIR BOLETIM
async function fazerLogin() {
  const inputPin = document.getElementById("pin-input");
  const msgLogin = document.getElementById("mensagem-login");
  const pinDigitado = inputPin.value.trim();

  if (!pinDigitado) {
    msgLogin.textContent = "Por favor, informe o PIN.";
    msgLogin.className = "mensagem-status erro";
    return;
  }

  msgLogin.textContent = "Conectando...";
  msgLogin.className = "mensagem-status info";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      msgLogin.className = "mensagem-status erro";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      msgLogin.className = "mensagem-status erro";
      return;
    }

    if (!resposta.ok) {
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      msgLogin.className = "mensagem-status erro";
      return;
    }

    const resultado = await resposta.json();
    pinSessao = pinDigitado;
    inputPin.value = "";

    if (resultado.dados && Array.isArray(resultado.dados.disciplinas) && resultado.dados.disciplinas.length > 0) {
      dadosBoletim = resultado.dados.disciplinas;
    }

    document.getElementById("area-login").classList.add("escondido");
    document.getElementById("conteudo-boletim").classList.remove("escondido");

    renderizarBoletim();
  } catch (erro) {
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    msgLogin.className = "mensagem-status erro";
  }
}

// MONTA FORMULÁRIO DE EDIÇÃO
function abrirEdicao() {
  const containerLista = document.getElementById("lista-edicao");
  containerLista.innerHTML = "";
  document.getElementById("mensagem-edicao").textContent = "";

  dadosBoletim.forEach((item, idx) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "edicao-item";

    const h4 = document.createElement("h4");
    h4.textContent = item.disciplina;
    itemDiv.appendChild(h4);

    const linhaCampos = document.createElement("div");
    linhaCampos.className = "campos-linha";

    const n1Val = normalizarNota(item.tri1);
    const n2Val = normalizarNota(item.tri2);
    const n3Val = normalizarNota(item.tri3);

    const arrFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];

    linhaCampos.innerHTML = `
      <div class="campo-box">
        <label>1º Tri Nota</label>
        <input type="text" id="n1-${idx}" value="${n1Val !== null ? n1Val : ""}" placeholder="0-10">
      </div>
      <div class="campo-box">
        <label>2º Tri Nota</label>
        <input type="text" id="n2-${idx}" value="${n2Val !== null ? n2Val : ""}" placeholder="0-10">
      </div>
      <div class="campo-box">
        <label>3º Tri Nota</label>
        <input type="text" id="n3-${idx}" value="${n3Val !== null ? n3Val : ""}" placeholder="0-10">
      </div>
      <div class="campo-box">
        <label>1º Tri Faltas</label>
        <input type="number" id="f1-${idx}" value="${arrFaltas[0] !== undefined ? arrFaltas[0] : 0}" min="0">
      </div>
      <div class="campo-box">
        <label>2º Tri Faltas</label>
        <input type="number" id="f2-${idx}" value="${arrFaltas[1] !== undefined ? arrFaltas[1] : 0}" min="0">
      </div>
      <div class="campo-box">
        <label>3º Tri Faltas</label>
        <input type="number" id="f3-${idx}" value="${arrFaltas[2] !== undefined ? arrFaltas[2] : 0}" min="0">
      </div>
    `;

    itemDiv.appendChild(linhaCampos);
    containerLista.appendChild(itemDiv);
  });

  document.getElementById("painel-edicao").classList.remove("escondido");
}

function fecharEdicao() {
  document.getElementById("painel-edicao").classList.add("escondido");
  document.getElementById("mensagem-edicao").textContent = "";
}

// VALIDAÇÃO DE NOTA DIGITADA (0 A 10, VAZIO -> NULL)
function validarNotaDigitada(str) {
  if (str === null || str === undefined) return { valida: true, valor: null };
  const s = String(str).trim();
  if (s === "") return { valida: true, valor: null };

  const adaptada = s.replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(adaptada)) {
    return { valida: false, valor: null };
  }

  const num = parseFloat(adaptada);
  if (isNaN(num) || num < 0 || num > 10) {
    return { valida: false, valor: null };
  }

  return { valida: true, valor: num };
}

// VALIDAÇÃO DE FALTA DIGITADA (INTEIRO >= 0)
function validarFaltaDigitada(str) {
  if (str === null || str === undefined) return { valida: false, valor: null };
  const s = String(str).trim();
  if (s === "" || !/^\d+$/.test(s)) {
    return { valida: false, valor: null };
  }

  const num = parseInt(s, 10);
  if (isNaN(num) || num < 0) {
    return { valida: false, valor: null };
  }

  return { valida: true, valor: num };
}

// SALVAR ALTERAÇÕES
async function salvarAlteracoes() {
  const msgEdicao = document.getElementById("mensagem-edicao");
  msgEdicao.textContent = "";
  msgEdicao.className = "mensagem-status";

  // Limpa classes de erro prévias
  const inputsAnteriores = document.querySelectorAll(".campo-invalido");
  inputsAnteriores.forEach(i => i.classList.remove("campo-invalido"));

  let existeErro = false;
  const novasDisciplinas = [];

  for (let idx = 0; idx < dadosBoletim.length; idx++) {
    const elN1 = document.getElementById(`n1-${idx}`);
    const elN2 = document.getElementById(`n2-${idx}`);
    const elN3 = document.getElementById(`n3-${idx}`);
    const elF1 = document.getElementById(`f1-${idx}`);
    const elF2 = document.getElementById(`f2-${idx}`);
    const elF3 = document.getElementById(`f3-${idx}`);

    const resN1 = validarNotaDigitada(elN1.value);
    if (!resN1.valida) { elN1.classList.add("campo-invalido"); existeErro = true; }

    const resN2 = validarNotaDigitada(elN2.value);
    if (!resN2.valida) { elN2.classList.add("campo-invalido"); existeErro = true; }

    const resN3 = validarNotaDigitada(elN3.value);
    if (!resN3.valida) { elN3.classList.add("campo-invalido"); existeErro = true; }

    const resF1 = validarFaltaDigitada(elF1.value);
    if (!resF1.valida) { elF1.classList.add("campo-invalido"); existeErro = true; }

    const resF2 = validarFaltaDigitada(elF2.value);
    if (!resF2.valida) { elF2.classList.add("campo-invalido"); existeErro = true; }

    const resF3 = validarFaltaDigitada(elF3.value);
    if (!resF3.valida) { elF3.classList.add("campo-invalido"); existeErro = true; }

    if (!existeErro) {
      novasDisciplinas.push({
        disciplina: dadosBoletim[idx].disciplina,
        tri1: resN1.valor,
        tri2: resN2.valor,
        tri3: resN3.valor,
        faltas: [resF1.valor, resF2.valor, resF3.valor]
      });
    }
  }

  if (existeErro) {
    msgEdicao.textContent = "Verifique os campos destacados com valores inválidos.";
    msgEdicao.className = "mensagem-status erro";
    return;
  }

  msgEdicao.textContent = "Salvando...";
  msgEdicao.className = "mensagem-status info";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      msgEdicao.textContent = "Falha ao salvar dados no servidor. Mantenha os campos e tente novamente.";
      msgEdicao.className = "mensagem-status erro";
      return;
    }

    dadosBoletim = novasDisciplinas;
    renderizarBoletim();

    msgEdicao.textContent = "Dados salvos com sucesso.";
    msgEdicao.className = "mensagem-status sucesso";

    setTimeout(() => {
      fecharEdicao();
    }, 1200);

  } catch (erro) {
    msgEdicao.textContent = "Falha ao conectar para salvar. Tente novamente.";
    msgEdicao.className = "mensagem-status erro";
  }
}

// INICIALIZAÇÃO DE EVENTOS
document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.getElementById("btn-entrar");
  if (btnEntrar) {
    btnEntrar.addEventListener("click", fazerLogin);
  }

  const pinInput = document.getElementById("pin-input");
  if (pinInput) {
    pinInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") fazerLogin();
    });
  }

  const btnAlterar = document.getElementById("btn-alterar-dados");
  if (btnAlterar) {
    btnAlterar.addEventListener("click", abrirEdicao);
  }

  const btnCancelar = document.getElementById("btn-cancelar");
  if (btnCancelar) {
    btnCancelar.addEventListener("click", fecharEdicao);
  }

  const btnSalvar = document.getElementById("btn-salvar");
  if (btnSalvar) {
    btnSalvar.addEventListener("click", salvarAlteracoes);
  }
});