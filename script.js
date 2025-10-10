document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA EL EFECTO DE TRANSICIÓN DE PÁGINA ---
    const transitionOverlay = document.createElement('div');
    transitionOverlay.classList.add('page-transition-overlay');
    document.body.appendChild(transitionOverlay);

    const clickSound = new Audio('click.mp3'); 

    const transitionLinks = document.querySelectorAll('.capitulo-card, .pasado-card, .nav-button, .home-button');

    transitionLinks.forEach(link => {
        if (link.classList.contains('disabled')) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const destinationURL = link.href;
            clickSound.play().catch(error => console.error("Error al reproducir audio:", error));
            transitionOverlay.classList.add('is-active');
            setTimeout(() => {
                window.location.href = destinationURL;
            }, 500);
        });
    });

    window.addEventListener('pageshow', () => {
        transitionOverlay.classList.remove('is-active');
    });

    // --- LÓGICA PARA EL VOCABULARIO INTERACTIVO (AHORA DINÁMICA) ---

    // 1. Identificar en qué capítulo estamos
    const chapterFilenames = {
        'mexico.html': 'Capítulo 1',
        'costarica.html': 'Capítulo 2',
        'colombia.html': 'CAPÍTULO 3', // Asegúrate de que coincida con el JSON
        'peru.html': 'CAPÍTULO 4',
        'chile.html': 'CAPÍTULO 5',
        'argentina.html': 'CAPÍTULO 6'
    };

    const currentPage = window.location.pathname.split('/').pop();
    const chapterIdentifier = chapterFilenames[currentPage];

    // 2. Si estamos en una página de capítulo, ejecutar la lógica
    if (chapterIdentifier) {
        const chapterContent = document.querySelector('.chapter-content');

        fetch('vocabulario.json')
            .then(response => response.json())
            .then(data => {
                const chapterData = data.vocabulario.find(cap => cap.capitulo.includes(chapterIdentifier));
                if (!chapterData) return;

                const allWords = chapterData.dias.flatMap(dia => dia.palabras);
                
                allWords.forEach(vocabItem => {
                    // Expresión regular para encontrar la palabra exacta (insensible a mayúsculas/minúsculas)
                    const regex = new RegExp(`\\b(${vocabItem.palabra})\\b`, 'gi');
                    chapterContent.innerHTML = chapterContent.innerHTML.replace(regex, (match) => {
                        return `
                            <span class="vocab-word" data-traduccion="${vocabItem.traduccion}">
                                ${match}
                                <span class="vocab-tooltip">${vocabItem.traduccion}</span>
                            </span>
                        `;
                    });
                });

                const vocabWords = document.querySelectorAll('.vocab-word');
                vocabWords.forEach(wordElement => {
                    wordElement.addEventListener('click', () => {
                        wordElement.classList.toggle('active');
                    });
                });

            })
            .catch(error => console.error('Error al cargar el vocabulario:', error));
    }
});
