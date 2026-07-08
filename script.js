document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. ЛОГИКА ДЛЯ ФОТО (НАРУЧНИКИ И КОЛЬЦА) --- */
    const movingWrappers = document.querySelectorAll('.handcuffs-wrapper');
    if (movingWrappers.length > 0) {
        window.addEventListener('scroll', () => {
            movingWrappers.forEach(wrapper => {
                const rect = wrapper.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                let progress = 1 - (rect.top / windowHeight);
                if (progress < 0) progress = 0;
                if (progress > 1) progress = 1;
                const translateX = 50 - (50 * progress);
                wrapper.style.transform = `translateX(${translateX}%)`;
            });
        });
        window.dispatchEvent(new Event('scroll'));
    }

    
    /* --- 3. ЛОГИКА ДЛЯ ПАЛИТРЫ (выезд слева) С УСКОРЕНИЕМ --- */
    const paletteWrapper = document.getElementById('palette-wrapper');
    
    if (paletteWrapper) {
        window.addEventListener('scroll', () => {
            const rect = paletteWrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            let progress = 1 - (rect.top / windowHeight);
            if (progress < 0) progress = 0;
            
            progress = Math.min(progress * 1.67, 1);
            
            const translateX = -50 + (50 * progress);
            paletteWrapper.style.transform = `translateX(${translateX}%)`;
        });
        
        window.dispatchEvent(new Event('scroll'));
    }


    /* --- РУКИ (с ускоренной анимацией) --- */
    const leftHandWrapper = document.getElementById('hand-left-wrapper');
    const rightHandWrapper = document.getElementById('hand-right-wrapper');

    if (leftHandWrapper && rightHandWrapper) {
        window.addEventListener('scroll', () => {
            const rect = leftHandWrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            let progress = 1 - (rect.top / windowHeight);
            if (progress < 0) progress = 0;
            
            progress = Math.min(progress * 1.67, 1);
            
            if (progress > 1) progress = 1;

            const leftEndPosition = -20.3895;
            const leftTranslateX = -100 + (leftEndPosition + 100) * progress;
            leftHandWrapper.style.transform = `translateX(${leftTranslateX}%)`;

            const rightEndPosition = 20.7122;
            const rightTranslateX = 100 - (100 - rightEndPosition) * progress;
            rightHandWrapper.style.transform = `translateX(${rightTranslateX}%)`;
        });
        
        window.dispatchEvent(new Event('scroll'));
    }


    /* --- 8. ЗАКЛЮЧЕНИЕ (запуск при появлении секции) --- */
    const finalSection = document.querySelector('.final-section');

    if (finalSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    finalSection.classList.add('active');
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(finalSection);
    }

    /* --- ФУТЕР (ИСПРАВЛЕННАЯ ВЕРСИЯ) --- */
    const footerWrapper = document.getElementById('footer-wrapper');
    const footerSection = document.getElementById('footer-section');

    if (footerWrapper && footerSection) {
        // Изначально футер скрыт за правым краем
        footerWrapper.style.transform = 'translateX(100%)';
        
        // Создаем наблюдатель для отслеживания появления футера
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Когда футер появляется, плавно выезжает
                    footerWrapper.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    footerWrapper.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.05 }); // Срабатывает когда видно 5% футера
        
        footerObserver.observe(footerSection);
    }


    // ========== ЗАСТАВКА И МУЗЫКА ==========
const splashScreen = document.getElementById('splashScreen');
const openBtn = document.getElementById('openInviteBtn');
let audio = null;

openBtn.addEventListener('click', () => {
    // Создаём и запускаем музыку
    audio = new Audio('1.mp3');
    audio.loop = true;
    audio.play().catch(() => {});

    // Прячем заставку
    splashScreen.classList.add('hidden');

    // Через 0.8с удаляем заставку из DOM (опционально)
    setTimeout(() => {
        splashScreen.style.display = 'none';
    }, 800);
});
});