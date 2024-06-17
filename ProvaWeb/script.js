document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const filterIcon = document.getElementById('filter-icon');
    const filterDialog = document.getElementById('filter-dialog');
    const applyFiltersButton = document.getElementById('apply-filters');
    const closeDialogButton = document.getElementById('close-dialog');
    const filterForm = document.getElementById('filter-form');
    const newsList = document.getElementById('news-list');
    const pagination = document.getElementById('pagination');
    const activeFiltersCount = document.getElementById('active-filters-count');
    let currentPage = 1;

    const fetchNews = (page = 1) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('page', page);
        searchParams.set('qtd', searchParams.get('quantidade') || 10);

        fetch(`https://servicodados.ibge.gov.br/api/v3/noticias/?${searchParams.toString()}`)
            .then(response => response.json())
            .then(data => {
                displayNews(data.items);
                setupPagination(data.totalPages, page);
            })
            .catch(error => console.error('Erro ao buscar notícias:', error));
    };

    const displayNews = (news) => {
        newsList.innerHTML = '';
        news.forEach(article => {
            const li = document.createElement('li');
            const imgUrl = addImagePrefix(article.imagens);
            const publishDate = new Date(article.data_publicacao);
            const today = new Date();
            const diffTime = Math.abs(today - publishDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const editorias = Array.isArray(article.editorias) ? article.editorias.map(e => e.nome).join(' #') : article.editorias || '';

            li.innerHTML = `
                <img src="${imgUrl}" alt="${article.titulo}" style="width:100%; height:auto;">
                <div class="news-content">
                    <h2>${article.titulo}</h2>
                    <p>${article.introducao}</p>
                    <p class="hashtags">#${editorias}</p>
                    <p class="date">Publicado há ${diffDays === 0 ? 'hoje' : diffDays === 1 ? 'ontem' : `${diffDays} dias`}</p>
                    <a href="${article.link}" target="_blank" class="read-more-btn">Leia Mais</a>
                </div>
            `;
            li.classList.add('news-item');
            newsList.appendChild(li);
        });
    };

    const setupPagination = (totalPages, currentPage) => {
        pagination.innerHTML = '';
        let startPage = Math.max(currentPage - 4, 1);
        let endPage = Math.min(startPage + 9, totalPages);

        if (endPage - startPage < 9) {
            startPage = Math.max(endPage - 9, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.toggle('active', i === currentPage);
            button.addEventListener('click', () => {
                window.history.pushState(null, '', `?${new URLSearchParams(window.location.search).toString().replace(/page=\d+/, `page=${i}`)}`);
                fetchNews(i);
            });
            pagination.appendChild(button);
        }
    };

    const updateActiveFiltersCount = () => {
        const searchParams = new URLSearchParams(window.location.search);
        let count = 0;

        for (const [key, value] of searchParams.entries()) {
            if (key !== 'page' && key !== 'busca' && value) {
                count++;
            }
        }

        activeFiltersCount.textContent = count > 0 ? count : '';
        activeFiltersCount.style.display = count > 0 ? 'inline' : 'none';
    };

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('busca', searchInput.value);
        searchParams.set('page', 1);
        window.history.pushState(null, '', `?${searchParams.toString()}`);
        fetchNews();
    });

    filterIcon.addEventListener('click', () => {
        filterDialog.showModal();
    });

    applyFiltersButton.addEventListener('click', () => {
        const formData = new FormData(filterForm);
        const searchParams = new URLSearchParams(window.location.search);

        formData.forEach((value, key) => {
            if (value) {
                searchParams.set(key, value);
            } else {
                searchParams.delete(key);
            }
        });

        searchParams.set('page', 1);
        window.history.pushState(null, '', `?${searchParams.toString()}`);
        updateActiveFiltersCount();
        fetchNews();
        filterDialog.close();
    });

    closeDialogButton.addEventListener('click', () => {
        filterDialog.close();
    });

    const addImagePrefix = (imagesString) => {
        try {
            const images = JSON.parse(imagesString);
            const imgUrl = images.image_fulltext || ''; 
            return `https://agenciadenoticias.ibge.gov.br/${imgUrl}`; // Adiciona o prefixo a todas as URLs das imagens
        } catch (error) {
            console.error('Erro ao extrair URL da imagem:', error);
            return 'https://via.placeholder.com/150'; 
        }
    };

    fetchNews(currentPage);
    updateActiveFiltersCount();
});
