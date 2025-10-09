document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA EL EFECTO DE TRANSICIÓN DE PÁGINA ---

    // 1. Crear la capa de transición y añadirla a la página
    const transitionOverlay = document.createElement('div');
    transitionOverlay.classList.add('page-transition-overlay');
    document.body.appendChild(transitionOverlay);

    // 2. Seleccionar todos los enlaces que deben tener el efecto
    // En este caso, los capítulos. Podríamos añadir más si quisiéramos.
    const transitionLinks = document.querySelectorAll('.capitulo-card');

    // 3. Añadir el evento a cada enlace
    transitionLinks.forEach(link => {
        // Ignoramos los capítulos desactivados
        if (link.classList.contains('disabled')) {
            return;
        }

        link.addEventListener('click', (e) => {
            // Prevenimos que el enlace nos lleve a la página de inmediato
            e.preventDefault();

            // Obtenemos la URL a la que queremos ir
            const destinationURL = link.href;

            // Activamos la animación de la capa (hacemos que cubra la pantalla)
            transitionOverlay.classList.add('is-active');

            // Esperamos a que la animación termine (500ms, como en el CSS)
            setTimeout(() => {
                // Navegamos a la nueva página
                window.location.href = destinationURL;
            }, 500);
        });
    });

    // 4. Asegurarnos de que la capa no se quede visible al usar los botones de "atrás/adelante" del navegador
    window.addEventListener('pageshow', () => {
        transitionOverlay.classList.remove('is-active');
    });

});
