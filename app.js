
let selecionado = null;
let produto = null;
const botao_pessoa = document.querySelectorAll(".botao_pessoa");
const botao_produto = document.querySelectorAll(".botao_produto");
const botao_finalizar = document.getElementById("btn-finalizar");

let carrinho = [];
const listaCarrinho = document.getElementById("lista-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");

let totais = {
  Rocha: 0,
  Quinze: 0,
  Kiko: 0,
  Pedro: 0,
  Brandão: 0,
  Preto: 0,
  Tomás: 0
};

let totalGeral = 0;

function atualizarCarrinho() {
    listaCarrinho.innerHTML = "";
    let total = 0;

    carrinho.forEach((item,index) => {
        const li = document.createElement("li");
        li.textContent = item.nome + " - " + item.preco.toFixed(2) + "€ ";

        const removerBtn = document.createElement("button");
        removerBtn.textContent = "X";
        removerBtn.className = "remover-btn";
        removerBtn.addEventListener("click", function() {
            carrinho.splice(index, 1);
            atualizarCarrinho();
        });

        li.appendChild(removerBtn);
        listaCarrinho.appendChild(li);
        total += item.preco;
    });
    totalCarrinho.textContent = total.toFixed(2) + "€";
}

function atualizarTotais() {
    document.getElementById("total-geral").textContent = totalGeral.toFixed(2) + "€";

    const lista = document.getElementById("lista-leaderboard");
    lista.innerHTML = "";
    const ordenado = Object.entries(totais).sort((a, b) => b[1] - a[1]);
    // Object.entries transforma { Rocha: 5, Kiko: 12 } em [["Rocha",5],["Kiko",12]]
    // sort compara os valores (posição [1]) do maior para o menor
    
    ordenado.forEach(([nome, total]) => {
        const li = document.createElement("li");
        li.textContent = nome + " - " + total.toFixed(2) + "€";
        lista.appendChild(li);
    });
}

botao_pessoa.forEach(function(botao) {
    botao.addEventListener("click", function() {
        selecionado = botao.getAttribute("data-nome");
        console.log("Selecionado:", selecionado);
        document.getElementById("selecionado").textContent = selecionado;
    });
});

botao_produto.forEach(function(botao) {
    botao.addEventListener("click", function() {
        if (!selecionado) {
            alert("Seleciona uma pessoa primeiro oh burro!");
            return;
        } 
        const nomeProduto = botao.dataset.nome;
        const precoProduto = parseFloat(botao.dataset.preco);
        carrinho.push({ nome: nomeProduto, preco: precoProduto });
        atualizarCarrinho();
        console.log("Produto adicionado:", nomeProduto, "Preço:", precoProduto);
    });
});

botao_finalizar.addEventListener("click", function() {
    if (carrinho.length === 0) {
        alert("O carrinho está vazio!");
        return;
    }

    carrinho.forEach(function(item) {
        totais[selecionado] += item.preco;
        totalGeral += item.preco;
    });
    
    carrinho = [];
    atualizarCarrinho();
    atualizarTotais();
    document.getElementById("selecionado").textContent = "Nenhum";
    selecionado = null;
});

atualizarTotais();