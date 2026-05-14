/* ============================================================
   script.js — Cavergy by 2D Madeira
   Menu hambúrguer, scroll suave, link ativo, ano dinâmico
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('header');
    const hamburguer = document.getElementById('hamburguer');
    const menuOverlay = document.getElementById('menuOverlay');
    const nav = document.getElementById('nav');
    const body = document.body;

    // Criar nav mobile
    const navMobile = document.createElement('nav');
    navMobile.className = 'nav nav--mobile';
    navMobile.id = 'navMobile';
    navMobile.setAttribute('aria-label', 'Menu de navegação mobile');
    const navListaOriginal = nav.querySelector('.nav__lista');
    if (navListaOriginal) {
        const navListaClone = navListaOriginal.cloneNode(true);
        navMobile.appendChild(navListaClone);
    }
    body.appendChild(navMobile);

    const navLinksMobile = navMobile.querySelectorAll('.nav__link');
    const todosNavLinks = document.querySelectorAll('.nav__link');

    function abrirMenu() {
        navMobile.classList.add('nav--mobile--ativo');
        menuOverlay.classList.add('menu-overlay--ativo');
        hamburguer.classList.add('hamburguer--ativo');
        hamburguer.setAttribute('aria-expanded', 'true');
        hamburguer.setAttribute('aria-label', 'Fechar menu de navegação');
        body.style.overflow = 'hidden';
    }

    function fecharMenu() {
        navMobile.classList.remove('nav--mobile--ativo');
        menuOverlay.classList.remove('menu-overlay--ativo');
        hamburguer.classList.remove('hamburguer--ativo');
        hamburguer.setAttribute('aria-expanded', 'false');
        hamburguer.setAttribute('aria-label', 'Abrir menu de navegação');
        body.style.overflow = '';
    }

    function alternarMenu() {
        if (navMobile.classList.contains('nav--mobile--ativo')) {
            fecharMenu();
        } else {
            abrirMenu();
        }
    }

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

        if (window.scrollY < 100) {
            secaoAtual = 'home';
        }

        todosNavLinks.forEach(link => {
            link.classList.remove('nav__link--ativo');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === secaoAtual) {
                link.classList.add('nav__link--ativo');
            }
        });
    }

    function atualizarHeaderSombra() {
        if (window.scrollY > 20) {
            header.classList.add('header--sombra');
        } else {
            header.classList.remove('header--sombra');
        }
    }

    hamburguer.addEventListener('click', alternarMenu);
    menuOverlay.addEventListener('click', fecharMenu);

    navLinksMobile.forEach(link => {
        link.addEventListener('click', () => {
            fecharMenu();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMobile.classList.contains('nav--mobile--ativo')) {
            fecharMenu();
        }
    });

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

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && navMobile.classList.contains('nav--mobile--ativo')) {
            fecharMenu();
        }
    });

    atualizarLinkAtivo();
    atualizarHeaderSombra();

    const anoAtualSpan = document.getElementById('anoAtual');
    if (anoAtualSpan) {
        anoAtualSpan.textContent = new Date().getFullYear();
    }

    // WhatsApp flutuante: esconder quando o rodapé estiver visível
    const whatsappBtn = document.getElementById('whatsappFlutuante');
    const rodape = document.getElementById('rodape');

    if (whatsappBtn && rodape) {
        function atualizarWhatsappVisibilidade() {
            const rodapeTopo = rodape.getBoundingClientRect().top;
            const windowAltura = window.innerHeight;

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

        atualizarWhatsappVisibilidade();
    }

    console.log('🌿 Cavergy — Site carregado com sucesso.');
});