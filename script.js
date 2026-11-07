// URL base da API pública Rick and Morty (não exige token)
const API = "https://rickandmortyapi.com/api/character";

const container = document.getElementById("cards");
const mensagem = document.getElementById("mensagem");
const busca = document.getElementById("busca");
const filtroStatus = document.getElementById("status");
const btnAnterior = document.getElementById("anterior");
const btnProxima = document.getElementById("proxima");
const spanPagina = document.getElementById("pagina");

let paginaAtual = 1;
const traducaoStatus = { Alive: "Vivo", Dead: "Morto", unknown: "Desconhecido" };

// Busca os personagens na API usando fetch e then
function carregarPersonagens() {
  const params = new URLSearchParams({ page: paginaAtual });
  if (busca.value) params.append("name", busca.value);
  if (filtroStatus.value) params.append("status", filtroStatus.value);

  mensagem.textContent = "Abrindo portal...";
  fetch(`${API}?${params}`)
    .then((resposta) => {
      if (!resposta.ok) throw new Error("Nenhum personagem encontrado");
      return resposta.json();
    })
    .then((dados) => {
      console.log("Resposta da API:", dados);
      mensagem.textContent = `${dados.info.count} personagens encontrados`;
      mostrarCards(dados.results);
      atualizarPaginacao(dados.info);
    })
    .catch((erro) => {
      container.innerHTML = "";
      mensagem.textContent = erro.message;
      atualizarPaginacao({ prev: null, next: null });
    });
}

// Cria cada card dinamicamente com createElement e appendChild
function mostrarCards(personagens) {
  container.innerHTML = "";
  personagens.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${i * 40}ms`;

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;
    img.loading = "lazy";

    const corpo = document.createElement("div");
    corpo.className = "card-corpo";

    const nome = document.createElement("h2");
    nome.textContent = p.name;

    const status = document.createElement("p");
    status.className = "status";
    const bolinha = document.createElement("span");
    bolinha.className = `bolinha ${p.status.toLowerCase()}`;
    status.appendChild(bolinha);
    status.append(`${traducaoStatus[p.status]} - ${p.species}`);

    corpo.appendChild(nome);
    corpo.appendChild(status);
    corpo.appendChild(criarInfo("Última localização:", p.location.name));
    corpo.appendChild(criarInfo("Origem:", p.origin.name));

    card.appendChild(img);
    card.appendChild(corpo);
    container.appendChild(card);
  });
}

function criarInfo(rotulo, valor) {
  const bloco = document.createElement("div");
  const r = document.createElement("p");
  r.className = "rotulo";
  r.textContent = rotulo;
  const v = document.createElement("p");
  v.className = "valor";
  v.textContent = valor;
  bloco.append(r, v);
  return bloco;
}

function atualizarPaginacao(info) {
  spanPagina.textContent = paginaAtual;
  btnAnterior.disabled = !info.prev;
  btnProxima.disabled = !info.next;
}

btnAnterior.addEventListener("click", () => { paginaAtual--; carregarPersonagens(); window.scrollTo(0, 0); });
btnProxima.addEventListener("click", () => { paginaAtual++; carregarPersonagens(); window.scrollTo(0, 0); });

let espera;
busca.addEventListener("input", () => {
  clearTimeout(espera);
  espera = setTimeout(() => { paginaAtual = 1; carregarPersonagens(); }, 400);
});
filtroStatus.addEventListener("change", () => { paginaAtual = 1; carregarPersonagens(); });

carregarPersonagens();
