// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, doc, setDoc, onSnapshot, increment, collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCDioGu6SoRinvAG4S7AbqhtRQX6ka8lJg",
    authDomain: "gota-tracker.firebaseapp.com",
    projectId: "gota-tracker",
    storageBucket: "gota-tracker.firebasestorage.app",
    messagingSenderId: "536190103178",
    appId: "1:536190103178:web:8bbbcaab61a0d21272c773"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


let selecionado = null;
const botao_pessoa = document.querySelectorAll(".botao_pessoa");
const botao_produto = document.querySelectorAll(".botao_produto");
const botao_finalizar = document.getElementById("btn-finalizar");

let carrinho = [];
const listaCarrinho = document.getElementById("lista-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");


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

function escutarTotais() {
    onSnapshot(collection(db, "totais"), (snapshot) => {
        const lista = document.getElementById("lista-leaderboard");
        lista.innerHTML = "";
        let geral = 0;

        const pessoas = [];
        snapshot.forEach(docSnap => {
            if (docSnap.id === "geral") {
                geral = docSnap.data().total;
            } else {
                pessoas.push([docSnap.id, docSnap.data().total]);
            }
        });

        pessoas.sort((a, b) => b[1] - a[1]);
        pessoas.forEach(([nome, total]) => {
            const li = document.createElement("li");
            li.textContent = nome + " - " + total.toFixed(2) + "€";
            lista.appendChild(li);
        });

        document.getElementById("total-geral").textContent = geral.toFixed(2) + "€";
    });
}


botao_pessoa.forEach(function(botao) {
    botao.addEventListener("click", function() {
        selecionado = botao.getAttribute("data-nome");
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
    });
});

botao_finalizar.addEventListener("click", async function() {
    if (carrinho.length === 0) {
        alert("O carrinho está vazio!");
        return;
    }

    let totalCompra = 0;
    carrinho.forEach(item => totalCompra += item.preco);

    // Soma ao documento da pessoa 
    await setDoc(doc(db, "totais", selecionado), { total: increment(totalCompra) }, { merge: true });

    // Soma ao total geral
    await setDoc(doc(db, "totais", "geral"), { total: increment(totalCompra) }, { merge: true });

    carrinho = [];
    atualizarCarrinho();
    document.getElementById("selecionado").textContent = "Nenhum";
    selecionado = null;
});


escutarTotais(); // chama-se uma vez; fica "ligado" para sempre a ouvir mudanças