// DADOS FICTÍCIOS PADRONIZADOS — 8º ANO (Array de Objetos)
const dadosBoletim = [
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

// FUNÇÃO PARA NORMALIZAR NOTAS PARA A ESCALA 0 A 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null; // Nota ainda não lançada
  }

  // Converte texto com vírgula para ponto e depois para número
  let num = parseFloat(String(valor).replace(",", "."));

  if (isNaN(num)) return null; // Valor inválido

  // Regra: valores entre 0 e 10 permanecem iguais
  if (num >= 0 && num <= 10) {
    return num;
  }

  // Regra: valores maiores que 10 e até 100 são divididos por 10
  if (num > 10 && num <= 100) {
    return num / 10;
  }

  return null; // Fora do intervalo válido
}

// FUNÇÃO PRINCIPAL QUE PROCESSA OS DADOS E ATUALIZA O DOM
function renderizarBoletim() {
  const tabelaCorpo = document.getElementById("tabela-corpo");
  tabelaCorpo.innerHTML = ""; // Limpa a tabela antes de preencher

  let somaMediasGerais = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let bomDesempenhoQtd = 0;
  let atencaoQtd = 0;

  // forEach: passa por cada uma das 15 disciplinas da lista
  dadosBoletim.forEach((item) => {
    // Normalizar as notas dos 3 trimestres
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Calcular soma e quantidade de notas válidas disponíveis
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

      // Estrutura de decisão (if/else) para definir a situação
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

    // Somar as faltas dos trimestres
    const totalFaltasDisciplina = item.faltas.reduce((acc, curr) => acc + curr, 0);
    totalFaltasGeral += totalFaltasDisciplina;

    // Formatar como a nota vai aparecer na tabela
    const formatarNota = (nota) => (nota !== null ? nota.toFixed(1).replace(".", ",") : "Ainda não lançada");

    // Adiciona uma linha na tabela (manipulando o DOM)
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${formatarNota(n1)}</td>
      <td>${formatarNota(n2)}</td>
      <td>${formatarNota(n3)}</td>
      <td><strong>${mediaTexto}</strong></td>
      <td>${totalFaltasDisciplina}</td>
      <td><span class="status ${classeStatus}">${situacao}</span></td>
    `;
    tabelaCorpo.appendChild(linha);
  });

  // Atualizar os Cards de Resumo no topo da página
  const mediaGeralFinal = qtdDisciplinasComMedia > 0 
    ? (somaMediasGerais / qtdDisciplinasComMedia).toFixed(1).replace(".", ",") 
    : "—";

  document.getElementById("media-geral").innerText = mediaGeralFinal;
  document.getElementById("total-faltas").innerText = totalFaltasGeral;
  document.getElementById("qtd-bom-desempenho").innerText = bomDesempenhoQtd;
  document.getElementById("qtd-atencao").innerText = atencaoQtd;

  /* 
    NOTA SOBRE FREQUÊNCIA:
    O valor de 92% e o texto "Frequência adequada" são apenas DEMONSTRATIVOS nesta versão fictícia,
    e serão calculados de forma dinâmica em futuras versões do projeto.
  */
}

// Executa o script assim que a página carregar
document.addEventListener("DOMContentLoaded", renderizarBoletim);