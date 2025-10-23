// URLs e Constantes
// Caminhos atualizados para os novos arquivos JSON
// Detecta caminho base dinamicamente para funcionar em diferentes estruturas
function getBaseDadosPath(file) {
    // Sempre retorna o caminho absoluto a partir da raiz do site
    return '/base_dados/' + file;
}

const ALL_BOOKS_URL = getBaseDadosPath('livros.json');       // Contém a lista completa para o Grid
const TOP_10_URL = getBaseDadosPath('top_10.json');           // Contém apenas os itens do Top 10 (3 livros)
const FEATURED_URL = getBaseDadosPath('lancamentos.json');    // Contém apenas o item de destaque (1 livro)


// Elementos DOM
const top10ListElement = document.getElementById('top-10-list');
const featuredCardElement = document.getElementById('featured-card-container');
const allBooksGridElement = document.getElementById('all-books-grid');

// --- Funções de Renderização (Mantidas e Otimizadas) ---

// Função utilitária (Removida, pois não é mais necessária)
// function getTitleFromUrl(url) { /* ... */ }

// Renderiza um item de livro simples (para Top 10 e Grid)
function renderBookItem(bookData, index) {
    // Usando operadores de coalescência nula (||) para garantir fallbacks
    let title = bookData.titulo || "Título Não Informado";
    let author = bookData.autor || "Autor Desconhecido"; 
    let coverUrl = bookData.link_capa;

    // Lógica de filtro/brilho para variar o estilo das capas
    let filterStyle = '';
    if (index % 3 === 0) filterStyle = 'filter: brightness(1.0);';
    else if (index % 3 === 1) filterStyle = 'filter: brightness(0.9);';
    else if (index % 3 === 2) filterStyle = 'filter: brightness(1.1);';
    
   
    return `
        <div class="book-item" data-book='${encodeURIComponent(JSON.stringify(bookData))}' style="cursor:pointer;">
            <div class="book-cover" style="background-image: url('${coverUrl || '../images/vagabond_cover.jpg'}'); ${filterStyle}"></div>
            <div class="book-info">
                <div class="book-title">${title}</div>
                <div class="book-author">${author}</div>
            </div>
        </div>
    `;
}


function renderSpecialBookItem(bookData) {
    let title = bookData.titulo || "Título Não Informado";
    let author = bookData.autor || "Autor Desconhecido";
    let likes = bookData.likes || '0';
   
    return `
        <div class="book-item book-item-with-zero" data-book='${encodeURIComponent(JSON.stringify(bookData))}' style="cursor:pointer;">
            <div class="book-cover jos-cover" style="background-image: url('images/jos_vagabumes.jpg');"></div>
            <div class="book-info">
                <div class="book-author">${title}</div>
                <div class="book-author zero-count">${likes}</div>
                <div class="book-author sub-author">${author}</div>
            </div>
        </div>
    `;

document.addEventListener('DOMContentLoaded', function() {
  
    function handleBookClick(e) {
        let el = e.target;
        while (el && el !== document.body) {
            if (el.classList.contains('book-item') && el.hasAttribute('data-book')) {
                try {
                    const bookData = JSON.parse(decodeURIComponent(el.getAttribute('data-book')));
                    localStorage.setItem('selectedBook', JSON.stringify(bookData));
                    
                    let livroPath = '';
                    if (window.location.pathname.includes('/html/')) {
                        livroPath = 'livro.html';
                    } else if (window.location.pathname.endsWith('home.html')) {
                        livroPath = 'livro.html';
                    } else {
                        livroPath = 'livro.html';
                    }
                    window.open(livroPath, '_blank');
                } catch (err) {
                    alert('Erro ao abrir detalhes do livro.');
                }
                break;
            }
            el = el.parentElement;
        }
    }
    document.body.addEventListener('click', handleBookClick);
});
}

// Renderiza o Card de Lançamento (Featured)
function renderFeaturedCard(bookData) {
    let title = (bookData.titulo || "NOVO LANÇAMENTO").toUpperCase();
    let description = bookData.sinopse || "";
    let likes = bookData.likes || '0';
    let coverUrl = bookData.link_capa;

    // Descrição fixa como fallback mais descritivo
    const fixedDescription = "Takezo Shinmen, um jovem notório por sua violência, é rebatizado como (Musashi Miyamoto) após sua jornada de redenção. Ele se afasta da brutalidade descontrolada e começa a se dedicar ao Bushidô, buscando transformar sua força bruta em habilidade, a fim de se tornar o maior espadachim do Japão.";
    
    // Lógica: Usa a sinopse do JSON se for >= 50 caracteres, senão usa a descrição fixa (fallback)
    const finalDescription = description.length > 50 ? description : fixedDescription;
    
    return `
        <div class="featured-card">
            <div class="featured-cover" style="background-image: url('${coverUrl || 'images/vagabond_vol1.jpg'}');"></div>
            <div class="featured-overlay">
                <p class="overlay-title">${title}</p>
                <p class="overlay-description">
                    ${finalDescription}
                </p>
                <p class="overlay-like">${likes}</p>
            </div>
        </div>
    `;
}

// --- FUNÇÃO PRINCIPAL DE CARREGAMENTO (AJUSTADA) ---

async function loadBooks() {
    // Função utilitária para buscar JSON e verificar erros
    const fetchData = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao buscar ${url}. Status: ${response.status}`);
        }
        return response.json();
    };

    try {
        // Usa Promise.all para carregar os três arquivos JSON em paralelo, otimizando o tempo.
        const [topBooks, featuredList, allBooks] = await Promise.all([
            fetchData(TOP_10_URL),
            fetchData(FEATURED_URL),
            fetchData(ALL_BOOKS_URL)
        ]);

        // 1. TOP 10 LIVROS (Renderização)
        if (topBooks && topBooks.length > 0) {
            // Cria uma cópia da lista e adiciona o primeiro item ao final para o efeito de loop visual
            const topBooksToRender = [...topBooks]; 
            topBooksToRender.push(topBooks[0]); 
            top10ListElement.innerHTML = topBooksToRender.map((book, index) => renderBookItem(book, index)).join('');
        } else {
            top10ListElement.innerHTML = `<p class="error-message">Nenhum livro encontrado no Top 10.</p>`;
        }

        // 2. LANÇAMENTOS (Item em destaque)
        if (featuredList && featuredList.length > 0) {
            // O arquivo lancamentos.json deve conter apenas o item de destaque no índice 0
            featuredCardElement.innerHTML = renderFeaturedCard(featuredList[0]);
        } else {
             featuredCardElement.innerHTML = `<p class="error-message">Nenhum lançamento encontrado.</p>`;
        }
        
        // 3. TODOS OS LIVROS (Grade)
        if (allBooks && allBooks.length > 0) {
            let allBooksHTML = '';
            allBooks.forEach((book, index) => {
                // Lógica de identificação do item especial permanece
                const isSpecialItem = (book.titulo && book.titulo.includes('O Túmulo dos Vagalumes')) || (book.autor && book.autor.includes('Akiyuki Nosaka'));
                
                if (isSpecialItem) {
                    allBooksHTML += renderSpecialBookItem(book);
                } else {
                    allBooksHTML += renderBookItem(book, index);
                }
            });
            allBooksGridElement.innerHTML = allBooksHTML;
        } else {
            allBooksGridElement.innerHTML = `<p class="error-message">Nenhum livro encontrado na lista completa.</p>`;
        }

    } catch (error) {
        console.error("Erro crítico ao carregar dados:", error);
        
        // Mensagens de erro visíveis na interface
        const msg = `<p style="padding: 20px; color: red;">ERRO CRÍTICO: Não foi possível carregar os dados. Verifique os caminhos dos arquivos JSON. Detalhe: ${error.message}</p>`;
        
        top10ListElement.innerHTML = msg;
        featuredCardElement.innerHTML = '';
        allBooksGridElement.innerHTML = '';
    }
}

// Inicia o carregamento quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', loadBooks);