export default class Form {
    constructor() {
        this.form = document.querySelector('.contact-us__form');
        this.nameInput = document.getElementById('firstName');
        this.phoneInput = document.getElementById('phoneNumber');
        this.messageInput = document.getElementById('message');
        
        if (!this.form) return;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', e => this.handleSubmit(e));
        
        [this.nameInput, this.messageInput].forEach(input => {
            if (input) this.handlePlaceholder(input);
        });
        
        if (this.phoneInput) {
            this.phoneInput.addEventListener('input', e => this.handlePhoneInput(e));
        }
    }
    
    handlePlaceholder(input) {
        const placeholder = input.nextElementSibling;
        if (!placeholder || !placeholder.classList.contains('field__placeholder')) return;
        
        this.updatePlaceholder(input, placeholder);
        
        input.addEventListener('input', () => this.updatePlaceholder(input, placeholder));
        input.addEventListener('focus', () => placeholder.style.opacity = '0');
        input.addEventListener('blur', () => this.updatePlaceholder(input, placeholder));
    }
    
    updatePlaceholder(input, placeholder) {
        placeholder.style.opacity = input.value ? '0' : '1';
    }
    
    handlePhoneInput(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0 && value[0] !== '7') {
            value = '7' + value;
        }
        
        if (value.length > 0) value = '+' + value;
        if (value.length > 2) value = value.substring(0, 2) + ' (' + value.substring(2);
        if (value.length > 7) value = value.substring(0, 7) + ') ' + value.substring(7);
        if (value.length > 12) value = value.substring(0, 12) + '-' + value.substring(12);
        if (value.length > 15) value = value.substring(0, 15) + '-' + value.substring(15, 17);
        
        e.target.value = value.substring(0, 19);
    }
    
    validateName() {
        if (!this.nameInput?.value.trim()) {
            this.showError(this.nameInput, 'Пожалуйста, введите ваше имя');
            return false;
        }
        
        this.removeError(this.nameInput);
        return true;
    }
    
    validatePhone() {
        if (!this.phoneInput) return false;
        
        const phoneValue = this.phoneInput.value.replace(/\D/g, '');
        
        if (!phoneValue) {
            this.showError(this.phoneInput, 'Пожалуйста, введите номер телефона');
            return false;
        }
        
        if (phoneValue.length < 11) {
            this.showError(this.phoneInput, 'Пожалуйста, введите корректный номер телефона');
            return false;
        }
        
        this.removeError(this.phoneInput);
        return true;
    }
    
    showError(input, message) {
        if (!input) return;
        
        this.removeError(input);
        
        const parent = input.closest('.field');
        if (!parent) return;
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field__error';
        errorElement.textContent = message;
        
        input.classList.add('field__control--error');
        parent.appendChild(errorElement);
    }
    
    removeError(input) {
        if (!input) return;
        
        const parent = input.closest('.field');
        if (!parent) return;
        
        const errorElement = parent.querySelector('.field__error');
        if (errorElement) errorElement.remove();
        
        input.classList.remove('field__control--error');
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateName() && this.validatePhone()) {
            alert('Форма отправлена');
            this.form.reset();
            
            [this.nameInput, this.messageInput].forEach(input => {
                if (!input) return;
                
                const placeholder = input.nextElementSibling;
                if (placeholder?.classList.contains('field__placeholder')) {
                    placeholder.style.opacity = '1';
                }
            });
        }
    }
}
