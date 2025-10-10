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

    // --- NUEVO: LÓGICA PARA EL VOCABULARIO INTERACTIVO ---

    // 1. Detectar si estamos en una página de capítulo (en este caso, México)
    const isMexicoPage = window.location.pathname.includes('mexico.html');

    if (isMexicoPage) {
        // Obtenemos los contenedores del DOM
        const chapterContent = document.querySelector('.chapter-content');
        const vocabList = document.getElementById('vocab-list');
        const clickedWords = new Set(); // Para no añadir palabras repetidas a la lista

        // 2. Cargar el archivo JSON con el vocabulario
        fetch('vocabulario.json')
            .then(response => response.json())
            .then(data => {
                // Buscamos el vocabulario del Capítulo 1
                const capitulo1 = data.vocabulario.find(cap => cap.capitulo.includes("Capítulo 1"));
                if (!capitulo1) return;

                // Juntamos todas las palabras del capítulo 1 en una sola lista
                const allWords = capitulo1.dias.flatMap(dia => dia.palabras);
                
                // 3. Reemplazar las palabras en el texto
                allWords.forEach(vocabItem => {
                    const regex = new RegExp(`\\b(${vocabItem.palabra})\\b`, 'gi');
                    chapterContent.innerHTML = chapterContent.innerHTML.replace(regex, (match) => {
                        // Creamos el span que contendrá la palabra y la burbuja
                        return `
                            <span class="vocab-word" data-palabra="${vocabItem.palabra}" data-traduccion="${vocabItem.traduccion}">
                                ${match}
                                <span class="vocab-tooltip">${vocabItem.traduccion}</span>
                            </span>
                        `;
                    });
                });

                // 4. Añadir eventos de clic a las nuevas palabras resaltadas
                const vocabWords = document.querySelectorAll('.vocab-word');
                vocabWords.forEach(wordElement => {
                    wordElement.addEventListener('click', () => {
                        // Mostramos u ocultamos la burbuja
                        wordElement.classList.toggle('active');

                        const palabra = wordElement.dataset.palabra;
                        const traduccion = wordElement.dataset.traduccion;

                        // Añadimos la palabra a la lista de abajo si no está ya
                        if (!clickedWords.has(palabra)) {
                            const listItem = document.createElement('li');
                            listItem.innerHTML = `<strong>${palabra}:</strong> ${traduccion}`;
                            vocabList.appendChild(listItem);
                            clickedWords.add(palabra);
                        }
                    });
                });

            })
            .catch(error => console.error('Error al cargar el vocabulario:', error));
    }
});
