// script_livro.js
// Este script exibe os detalhes do livro selecionado e implementa o botão 'Ler'.

// Função utilitária para obter dados do livro do localStorage
function getBookData() {
    const data = localStorage.getItem('selectedBook');
    return data ? JSON.parse(data) : null;
}

function renderBookDetails(book) {
    if (!book) {
        document.getElementById('book-details-container').innerHTML = '<p style="color:red; padding:20px;">Livro não encontrado.</p>';
        return;
    }
    const coverUrl = book.link_capa || '/images/vagabond_cover.jpg';
    const title = book.titulo || 'Título Não Informado';
    const author = book.autor || 'Autor Desconhecido';
    const sinopse = book.sinopse || 'Sem sinopse disponível.';
    const genero = book.genero || '';
    const likes = book.likes || '0';
    const classificacao = book.classificacao || '';
    const linkAcesso = book.link_acesso || '';

    document.getElementById('book-details-container').innerHTML = `
        <div class="book-details-card">
            <div class="book-details-cover" style="background-image: url('${coverUrl}');"></div>
            <div class="book-details-info">
                <h2>${title}</h2>
                <p><strong>Autor:</strong> ${author}</p>
                <p><strong>Gênero:</strong> ${genero}</p>
                <p><strong>Classificação:</strong> ${classificacao}</p>
                <p><strong>Likes:</strong> ${likes}</p>
                <p><strong>Sinopse:</strong> ${sinopse}</p>
                <button id="ler-btn" class="ler-btn" ${linkAcesso ? '' : 'disabled'}>Ler</button>
            </div>
        </div>
    `;
    // Botão Ler
    document.getElementById('ler-btn').onclick = function() {
        if (linkAcesso) {
            window.open(linkAcesso, '_blank');
        }
    };
}

document.addEventListener('DOMContentLoaded', function() {
    const book = getBookData();
    renderBookDetails(book);
});
