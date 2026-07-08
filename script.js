// ==============================================
// СВАДЕБНЫЙ САЙТ - ДАНИИЛ & ЮЛИЯ
// Интеграция с Google Sheets
// ==============================================

(function() {
    // ========== КОНФИГУРАЦИЯ ==========
    // ⚠️ ЗАМЕНИТЕ ЭТОТ URL НА ВАШ URL ИЗ APPS SCRIPT ⚠️
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxwi3MkPc73CWMiUwqTzpmyVuYkA_M9XT_9iI-PCjb8WdUZslqmzSqrOFVSuRwmK09u/exec';
    
    let isSubmitting = false;
    
    // ========== БАЗОВЫЕ СТИЛИ АНИМАЦИЙ ==========
    const coreStyles = document.createElement('style');
    coreStyles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(coreStyles);
    
    // ========== УНИВЕРСАЛЬНОЕ МОДАЛЬНОЕ ОКНО ==========
    function showModal(title, message, isError = false) {
        const existingModal = document.getElementById('customModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'customModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const icon = isError ? '✕' : '✓';
        const iconColor = isError ? '#c62828' : '#2e7d32';
        const bgIconColor = isError ? '#ffebee' : '#e8f5e9';
        const borderColor = isError ? '#c62828' : '#2e7d32';

        modal.innerHTML = `
            <div style="
                background: #ffffff;
                border-radius: 16px;
                padding: 32px 40px;
                max-width: 380px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 35px rgba(0, 0, 0, 0.15);
                animation: slideUp 0.3s ease;
                border-top: 3px solid ${borderColor};
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            ">
                <div style="
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: ${bgIconColor};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px auto;
                ">
                    <div style="
                        font-size: 32px;
                        font-weight: 400;
                        color: ${iconColor};
                        line-height: 1;
                    ">${icon}</div>
                </div>
                <h3 style="
                    font-size: 24px;
                    font-weight: 500;
                    color: #1a1a1a;
                    margin-bottom: 12px;
                    letter-spacing: -0.3px;
                ">${title}</h3>
                <p style="
                    font-size: 16px;
                    color: #555555;
                    margin-bottom: 28px;
                    line-height: 1.5;
                ">${message}</p>
                <button onclick="this.closest('#customModal').remove()" style="
                    background: #f5f5f5;
                    color: #333333;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 40px;
                    font-family: inherit;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                " onmouseover="this.style.background='#e8e8e8'" onmouseout="this.style.background='#f5f5f5'">
                    Закрыть
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        if (!isError) {
            setTimeout(() => {
                if (modal.parentElement) modal.remove();
            }, 4000);
        }
    }
    
    // ========== МОДАЛЬНОЕ ОКНО ЗАГРУЗКИ ==========
    function showLoadingModal() {
        const existingLoading = document.getElementById('loadingModal');
        if (existingLoading) existingLoading.remove();
        
        const loadingModal = document.createElement('div');
        loadingModal.id = 'loadingModal';
        loadingModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(3px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        loadingModal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 32px 40px;
                text-align: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            ">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 3px solid #e0e0e0;
                    border-top-color: #222;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    animation: spin 1s linear infinite;
                "></div>
                <p style="
                    font-size: 15px;
                    color: #222;
                    margin: 0;
                    font-weight: 500;
                ">Отправка ответа...</p>
            </div>
        `;
        document.body.appendChild(loadingModal);
        return loadingModal;
    }
    
    // ========== ОТПРАВКА В GOOGLE SHEETS ==========
    async function sendToGoogleSheets(formData) {
        const formBody = new URLSearchParams();
        formBody.append('name', formData.name);
        formBody.append('attendance', formData.attendance);
        if (formData.alcohol) formBody.append('alcohol', formData.alcohol);
        
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formBody.toString()
        });
        
        const result = await response.json();
        return result;
    }
    
    // ========== ЗАСТАВКА И МУЗЫКА ==========
    function initSplash() {
        const splashScreen = document.getElementById('splashScreen');
        const openBtn = document.getElementById('openInviteBtn');
        let audio = null;

        if (openBtn && splashScreen) {
            openBtn.addEventListener('click', () => {
                audio = new Audio('1.mp3');
                audio.loop = true;
                audio.play().catch(() => {});

                splashScreen.classList.add('hidden');

                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 800);
            });
        }
    }
    
    // ========== ИНИЦИАЛИЗАЦИЯ ФОРМЫ ==========
    function initRSVPForm() {
        const nameInput = document.querySelector('.attend-input');
        const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
        const alcoholCheckboxes = document.querySelectorAll('input[name="alcohol"]');
        const agreeCheck = document.getElementById('agree-check');
        const submitBtn = document.querySelector('.attend-submit');
        
        if (!submitBtn) {
            console.error('❌ Кнопка отправки не найдена!');
            return;
        }
        
        console.log('✅ Форма найдена, инициализация...');
        
        submitBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            if (isSubmitting) return;
            
            const name = nameInput ? nameInput.value.trim() : '';
            
            let attendance = null;
            attendanceRadios.forEach(radio => {
                if (radio.checked) attendance = radio.value;
            });
            
            // Собираем алкогольные предпочтения
            let alcoholValues = [];
            alcoholCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    alcoholValues.push(checkbox.value);
                }
            });
            const alcoholString = alcoholValues.length ? alcoholValues.join(', ') : '';
            
            // Валидация
            if (!name) {
                showModal('Ошибка', 'Пожалуйста, введите ваше ФИО', true);
                if (nameInput) nameInput.focus();
                return;
            }
            
            if (!attendance) {
                showModal('Ошибка', 'Пожалуйста, выберите вариант присутствия', true);
                return;
            }
            
            if (!agreeCheck || !agreeCheck.checked) {
                showModal('Ошибка', 'Пожалуйста, подтвердите согласие', true);
                return;
            }
            
            // Блокируем кнопку
            isSubmitting = true;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';
            }
            
            const loadingModal = showLoadingModal();
            
            try {
                const formData = { 
                    name: name, 
                    attendance: attendance,
                    alcohol: alcoholString
                };
                
                const result = await sendToGoogleSheets(formData);
                
                loadingModal.remove();
                
                if (result.result === 'success') {
                    let responseMessage = '';
                    if (attendance === 'yes') {
                        responseMessage = `Спасибо, ${name}! Будем ждать вас на нашей свадьбе 12 сентября 2026 года! 🎉`;
                    } else {
                        responseMessage = `Спасибо за ответ, ${name}! Очень жаль, что вы не сможете быть с нами.`;
                    }
                    
                    showModal('Ответ отправлен!', responseMessage, false);
                    
                    // Очищаем форму
                    if (nameInput) nameInput.value = '';
                    attendanceRadios.forEach(radio => radio.checked = false);
                    alcoholCheckboxes.forEach(checkbox => checkbox.checked = false);
                    if (agreeCheck) agreeCheck.checked = false;
                    
                    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
                } else {
                    throw new Error(result.message || 'Ошибка отправки');
                }
            } catch (error) {
                loadingModal.remove();
                showModal('Ошибка', error.message || 'Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.', true);
            } finally {
                isSubmitting = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Отправить';
                }
            }
        });
    }
    
    // ========== СУЩЕСТВУЮЩИЕ АНИМАЦИИ (СОХРАНЯЕМ) ==========
    function initAnimations() {
        // 1. Наручники и кольца
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

        // 2. Палитра
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

        // 3. Руки
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

        // 4. Заключение
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

        // 5. Футер
        const footerWrapper = document.getElementById('footer-wrapper');
        const footerSection = document.getElementById('footer-section');

        if (footerWrapper && footerSection) {
            footerWrapper.style.transform = 'translateX(100%)';
            const footerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        footerWrapper.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        footerWrapper.style.transform = 'translateX(0)';
                    }
                });
            }, { threshold: 0.05 });
            footerObserver.observe(footerSection);
        }
    }
    
    // ========== ЗАПУСК ==========
    document.addEventListener('DOMContentLoaded', function() {
        // Заставка
        initSplash();
        
        // Анимации
        initAnimations();
        
        // Форма
        initRSVPForm();
        
        console.log('✅ Форма RSVP готова к отправке в Google Sheets');
        console.log('📊 URL скрипта:', SCRIPT_URL);
    });
    
})();
