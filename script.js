// Aguarda o DOM estar completamente carregado para executar o script
document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------
    //  LÓGICA DO FUNDO DE PARTÍCULAS
    // ---------------------------------
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(227, 200, 255, 0.05)';
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * .4) - .2;
            let directionY = (Math.random() * .4) - .2;
            particlesArray.push(new Particle(x, y, directionX, directionY, size));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        initParticles();
    });
    
    // ---------------------------------
    //  LÓGICA DA APLICAÇÃO
    // ---------------------------------
    const screens = {
        loading: document.getElementById("loadingScreen"),
        start: document.getElementById("startScreen"),
        memories: document.getElementById("memoriesScreen"),
        final: document.getElementById("finalMessageScreen")
    };
    
    const startButton = document.getElementById("startButton");
    const music = document.getElementById("music");
    const counterTextEl = document.getElementById("counter-text");
    const photoEl = document.getElementById("photo");
    const videoEl = document.getElementById("video");
    const videoSource = document.getElementById("videoSource");
    const captionEl = document.getElementById("caption");
    const progressBar = document.querySelector('.progress-bar');

    const startDate = new Date("2018-09-21T00:00:00");
    let currentMediaIndex = 0;
    let counterInterval;

    const mediaItems = [
      { src: "fotos/foto2018.jpg", caption: "O nosso primeiro passeio: 2018 🥰", type: "image" },
      { src: "fotos/foto2019.jpg", caption: "Aqueles dias inesquecíveis!: 2019", type: "image" },
      { src: "fotos/foto2020.jpg", caption: "Aqueles dias inesquecíveis! 2020", type: "image" },
      { src: "fotos/foto2021(2).jpg", caption: "Sempre juntos: 2021", type: "image" },
      { src: "fotos/foto2021.jpg", caption: "O pedido: 2021", type: "image" },
      { src: "fotos/foto2022(2).jpg", caption: "Passeios: 2022", type: "image" },
      { src: "fotos/foto2022(3).jpg", caption: "Mais passeios: 2022", type: "image" },
      { src: "fotos/foto2022(4).jpg", caption: "A nossa primeira viagem: 2022", type: "image" },
      { src: "fotos/foto2022.jpg", caption: "Festa 2022", type: "image" },
      { src: "fotos/foto2023(1).jpg", caption: "Feira vegana: 2023", type: "image" },
      { src: "fotos/foto2023(2).jpg", caption: "Ouro Preto: 2023", type: "image" },
      { src: "fotos/foto2023(3).jpg", caption: "Parques: 2023", type: "image" },
      { src: "fotos/foto2023(4).jpg", caption: "Paciência kkkkkk: 2023", type: "image" },
      { src: "fotos/foto2023(5).webp", caption: "Mais momentos: 2023", type: "image" },
      { src: "fotos/foto2023.jpg", caption: "Concerto: 2023", type: "image" },
      { src: "fotos/foto2024(1).jpg", caption: "Jogo do nosso Cruzeiro: 2024", type: "image" },
      { src: "fotos/foto2024.jpg", caption: "Pinheiros de algum lugar kkkkk: 2024", type: "image" },
      { src: "fotos/foto2025(1).jpg", caption: "Carnaval: 2025", type: "image" },
      { src: "fotos/foto2025(2).jpg", caption: "Bienal, restaurante vegano, Rio: 2025", type: "image" },
      { src: "video/videoaleatorio.mp4", caption: "Um vídeo especial ❤", type: "video" },
      { src: "fotos/aleatoria.jpg", caption: "❤", type: "image" },
      { src: "fotos/aleatoria2.jpg", caption: "❤", type: "image" },
      { src: "fotos/aleatoria3.jpg", caption: "❤", type: "image" },
      { src: "fotos/aleatoria4.jpg", caption: "❤", type: "image" }
    ];

    function preloadMedia() {
        const imagePromises = mediaItems
            .filter(item => item.type === 'image')
            .map(item => new Promise((resolve, reject) => {
                const img = new Image();
                img.src = item.src;
                img.onload = resolve;
                img.onerror = reject;
            }));

        Promise.all(imagePromises)
            .then(() => switchScreen(screens.loading, screens.start))
            .catch(err => {
                console.error("Erro ao carregar imagens.", err);
                switchScreen(screens.loading, screens.start);
            });
    }
    
    function switchScreen(hideScreen, showScreen) {
        if (hideScreen) hideScreen.classList.remove('active');
        if (showScreen) showScreen.classList.add('active');
    }

    function updateCounter() {
        let now = new Date();
        let diff = now - startDate;
        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let days = now.getDate() - startDate.getDate();
        if (days < 0) {
            months--;
            days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        const hours = Math.floor((diff % (864e5)) / (36e5));
        const minutes = Math.floor((diff % (36e5)) / (6e4));

        // MODIFICAÇÃO PRINCIPAL: Texto do contador por extenso.
        counterTextEl.textContent = `${years} anos, ${months} meses, ${days} dias, ${hours} horas e ${minutes} minutos juntos`;
    }

    function animateCaption(text) {
        captionEl.innerHTML = ''; // Limpa a legenda anterior
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Usa non-breaking space para espaços
            span.style.animationDelay = `${index * 0.05}s`;
            captionEl.appendChild(span);
        });
    }
    
    function showNextMedia() {
        if (currentMediaIndex >= mediaItems.length) {
            clearInterval(counterInterval);
            switchScreen(screens.memories, screens.final);
            return;
        }

        const item = mediaItems[currentMediaIndex];
        const duration = item.type === "video" ? 25000 : 8000;
        
        photoEl.classList.remove('active');
        videoEl.classList.remove('active');
        
        progressBar.classList.remove('animate');
        progressBar.style.transitionDuration = '0s';
        progressBar.style.width = '0%';
        
        setTimeout(() => {
            if (item.type === "image") {
                photoEl.style.display = 'block';
                videoEl.style.display = 'none';
                photoEl.src = item.src;
                photoEl.classList.add('active');
            } else if (item.type === "video") {
                videoEl.style.display = 'block';
                photoEl.style.display = 'none';
                videoSource.src = item.src;
                videoEl.load();
                videoEl.play();
                videoEl.classList.add('active');
            }
            
            animateCaption(item.caption);
            
            void progressBar.offsetWidth; 

            progressBar.style.transitionDuration = `${duration}ms`;
            progressBar.classList.add('animate');
            
            currentMediaIndex++;
            setTimeout(showNextMedia, duration);

        }, 1500);
    }

    function startExperience() {
        switchScreen(screens.start, screens.memories);
        music.play().catch(error => console.warn("Autoplay da música bloqueado."));
        updateCounter();
        counterInterval = setInterval(updateCounter, 60000);
        showNextMedia();
    }

    // Inicialização
    initParticles();
    animateParticles();
    preloadMedia();
    startButton.addEventListener("click", startExperience);
});

