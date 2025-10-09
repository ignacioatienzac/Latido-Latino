document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA EL EFECTO DE TRANSICIÓN DE PÁGINA ---

    // 1. Crear la capa de transición y añadirla a la página
    const transitionOverlay = document.createElement('div');
    transitionOverlay.classList.add('page-transition-overlay');
    document.body.appendChild(transitionOverlay);

    // 2. Cargar el archivo de sonido para el clic usando la ruta relativa correcta
    const clickSound = new Audio('click.mp3');

    // 3. Seleccionar todos los enlaces que deben tener el efecto y el sonido
    const transitionLinks = document.querySelectorAll('.capitulo-card, .pasado-card, .nav-button');

    // 4. Añadir el evento a cada enlace
    transitionLinks.forEach(link => {
        // Ignoramos los elementos desactivados
        if (link.classList.contains('disabled')) {
            return;
        }

        link.addEventListener('click', (e) => {
            // Prevenimos que el enlace nos lleve a la página de inmediato
            e.preventDefault();

            // Obtenemos la URL a la que queremos ir
            const destinationURL = link.href;

            // Reproducimos el sonido del clic
            const promise = clickSound.play();
            if (promise !== undefined) {
                promise.catch(error => {
                    // Muestra un error en la consola si el navegador bloquea el audio
                    console.error("Error al reproducir el audio:", error);
                });
            }

            // Activamos la animación de la capa (hacemos que cubra la pantalla)
            transitionOverlay.classList.add('is-active');

            // Esperamos a que la animación termine (500ms, como en el CSS)
            setTimeout(() => {
                // Navegamos a la nueva página
                window.location.href = destinationURL;
            }, 500);
        });
    });

    // 5. Asegurarnos de que la capa no se quede visible al usar los botones de "atrás/adelante" del navegador
    window.addEventListener('pageshow', () => {
        transitionOverlay.classList.remove('is-active');
    });

});
