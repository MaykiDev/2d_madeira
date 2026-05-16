/* ============================================================
   script.js — 2D Madeira
   Menu hambúrguer, scroll suave, navegação ativa,
   WhatsApp flutuante, ano dinâmico no rodapé
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== ELEMENTOS DO DOM ====================
    const header = document.getElementById('header');
    const hamburguer = document.getElementById('hamburguer');
    const menuOverlay = document.getElementById('menuOverlay');
    const nav = document.getElementById('nav');
    const body = document.body;

    // Criar nav mobile dinamicamente
    const navMobile = document.createElement('nav');
    navMobile.className = 'nav nav--mobile';
    navMobile.id = 'navMobile';
    navMobile.setAttribute('aria-label', 'Menu de navegação mobile');
    // Clonar a lista de links do nav desktop
    const navListaOriginal = nav.querySelector('.nav__lista');
    if (navListaOriginal) {
        const navListaClone = navListaOriginal.cloneNode(true);
        navMobile.appendChild(navListaClone);
    }
    body.appendChild(navMobile);

    // Atualizar referência
    const navLinksMobile = navMobile.querySelectorAll('.nav__link');
    const todosNavLinks = document.querySelectorAll('.nav__link');

    // ==================== FUNÇÕES ====================

    // Abrir menu mobile
    function abrirMenu() {
        navMobile.classList.add('nav--mobile--ativo');
        menuOverlay.classList.add('menu-overlay--ativo');
        hamburguer.classList.add('hamburguer--ativo');
        hamburguer.setAttribute('aria-expanded', 'true');
        hamburguer.setAttribute('aria-label', 'Fechar menu de navegação');
        body.style.overflow = 'hidden';
    }

    // Fechar menu mobile
    function fecharMenu() {
        navMobile.classList.remove('nav--mobile--ativo');
        menuOverlay.classList.remove('menu-overlay--ativo');
        hamburguer.classList.remove('hamburguer--ativo');
        hamburguer.setAttribute('aria-expanded', 'false');
        hamburguer.setAttribute('aria-label', 'Abrir menu de navegação');
        body.style.overflow = '';
    }

    // Alternar menu
    function alternarMenu() {
        if (navMobile.classList.contains('nav--mobile--ativo')) {
            fecharMenu();
        } else {
            abrirMenu();
        }
    }

    // Atualizar link ativo baseado no scroll
    function atualizarLinkAtivo() {
        const secoes = document.querySelectorAll('section[id], div[id]');
        const scrollPos = window.scrollY + 120;

        let secaoAtual = '';

        secoes.forEach((secao) => {
            const id = secao.getAttribute('id');
            if (!id) return;
            const topo = secao.offsetTop;
            const altura = secao.offsetHeight;

            if (scrollPos >= topo && scrollPos < topo + altura) {
                secaoAtual = id;
            }
        });

        // Se estiver no topo da página
        if (window.scrollY < 100) {
            secaoAtual = 'home';
        }

        // Atualizar links
        todosNavLinks.forEach(link => {
            link.classList.remove('nav__link--ativo');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === secaoAtual) {
                link.classList.add('nav__link--ativo');
            }
        });
    }

    // Sombrear header no scroll
    function atualizarHeaderSombra() {
        if (window.scrollY > 20) {
            header.classList.add('header--sombra');
        } else {
            header.classList.remove('header--sombra');
        }
    }

    // ==================== EVENT LISTENERS ====================

    // Hambúrguer click
    hamburguer.addEventListener('click', alternarMenu);

    // Overlay click (fecha o menu)
    menuOverlay.addEventListener('click', fecharMenu);

    // Links do menu mobile fecham o menu ao clicar
    navLinksMobile.forEach(link => {
        link.addEventListener('click', () => {
            fecharMenu();
            // Scroll suave é feito pelo CSS (scroll-behavior: smooth)
        });
    });

    // Fechar menu com tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMobile.classList.contains('nav--mobile--ativo')) {
            fecharMenu();
        }
    });

    // Scroll: atualizar link ativo e sombra do header
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                atualizarLinkAtivo();
                atualizarHeaderSombra();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Resize: fechar menu mobile se a tela aumentar
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && navMobile.classList.contains('nav--mobile--ativo')) {
            fecharMenu();
        }
    });

    // ==================== INICIALIZAÇÃO ====================
    atualizarLinkAtivo();
    atualizarHeaderSombra();

    // ==================== HERO CAROUSEL ====================
    const carouselSlides = document.querySelectorAll('.hero-carousel__slide');
    const carouselIndicadores = document.querySelectorAll('.hero-carousel__indicador');
    const prevBtn = document.querySelector('.hero-carousel__controle--prev');
    const nextBtn = document.querySelector('.hero-carousel__controle--next');
    let currentSlide = 0;
    let slideInterval;

    if (carouselSlides.length > 0) {
        function showSlide(index) {
            carouselSlides.forEach((slide, i) => {
                slide.classList.remove('hero-carousel__slide--ativo');
                if (carouselIndicadores[i]) {
                    carouselIndicadores[i].classList.remove('hero-carousel__indicador--ativo');
                }
            });
            carouselSlides[index].classList.add('hero-carousel__slide--ativo');
            if (carouselIndicadores[index]) {
                carouselIndicadores[index].classList.add('hero-carousel__indicador--ativo');
            }
            currentSlide = index;
        }

        function nextSlide() {
            let index = (currentSlide + 1) % carouselSlides.length;
            showSlide(index);
        }

        function prevSlide() {
            let index = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
            showSlide(index);
        }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

        carouselIndicadores.forEach((ind, i) => {
            ind.addEventListener('click', () => {
                showSlide(i);
                resetInterval();
            });
        });

        function startInterval() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        startInterval();
    }

    // Ano dinâmico no rodapé
    const anoAtualSpan = document.getElementById('anoAtual');
    if (anoAtualSpan) {
        anoAtualSpan.textContent = new Date().getFullYear();
    }

    // ==================== WHATSAPP FLUTUANTE - OCULTAR NO SCROLL PARA O RODAPÉ ====================
    const whatsappBtn = document.getElementById('whatsappFlutuante');
    const rodape = document.getElementById('rodape');

    if (whatsappBtn && rodape) {
        function atualizarWhatsappVisibilidade() {
            const rodapeTopo = rodape.getBoundingClientRect().top;
            const windowAltura = window.innerHeight;

            // Se o rodapé estiver visível na tela
            if (rodapeTopo < windowAltura + 100) {
                whatsappBtn.style.opacity = '0';
                whatsappBtn.style.pointerEvents = 'none';
                whatsappBtn.style.transform = 'translateY(20px)';
            } else {
                whatsappBtn.style.opacity = '1';
                whatsappBtn.style.pointerEvents = 'auto';
                whatsappBtn.style.transform = 'translateY(0)';
            }
        }

        let whatsappTicking = false;
        window.addEventListener('scroll', () => {
            if (!whatsappTicking) {
                requestAnimationFrame(() => {
                    atualizarWhatsappVisibilidade();
                    whatsappTicking = false;
                });
                whatsappTicking = true;
            }
        });

        // Verificar visibilidade inicial
        atualizarWhatsappVisibilidade();
    }

    // ==================== LOG (DESENVOLVIMENTO) ====================
    console.log('🌿 2D Madeira — Site institucional carregado com sucesso.');
    console.log('📱 Menu mobile pronto. Navegação por scroll ativa.');
    console.log('💬 WhatsApp flutuante configurado.');
});