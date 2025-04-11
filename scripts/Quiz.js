class Quiz {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.answers = {
            subject: [],
            knowledgeLevel: '',
            difficultyTime: '',
            contactInfo: {
                name: '',
                phone: ''
            }
        };

        this.progressBar = document.getElementById('progress-bar');
        this.steps = document.querySelectorAll('.quiz__step');
        this.subtitleElement = document.querySelector('.quiz__subtitle');
        
        this.stepTitles = [
            'По какому предмету испытываете трудности?',
            'Как вы оцениваете уровень знаний?',
            'Как давно испытываете трудности?',
            'Укажите имя и телефон, мы перезвоним для подтверждения записи',
            'Готово, наш специалист скоро свяжется с вами для уточнения деталей'
        ];
        
        this.nameInput = document.getElementById('quizName');
        this.phoneInput = document.getElementById('quizPhone');

        this.subjects = [
            { value: 'rus', label: 'Русский' },
            { value: 'math', label: 'Математика' },
            { value: 'hist', label: 'История' },
            { value: 'soc', label: 'Обществознание' },
            { value: 'phys', label: 'Физика' },
            { value: 'chem', label: 'Химия' },
            { value: 'bio', label: 'Биология' },
            { value: 'eng', label: 'Английский' },
            { value: 'chin', label: 'Китайский' },
            { value: 'kor', label: 'Корейский' },
            { value: 'jap', label: 'Японский' },
            { value: 'inf', label: 'Информатика' },
            { value: 'lit', label: 'Литература' },
            { value: 'sch', label: 'Подготовка К Школе' },
            { value: 'elem', label: 'Начальные классы' }
        ];

        this.knowledgeLevels = [
            { value: 'zero', label: 'Вообще ничего не знаю' },
            { value: 'beginner', label: 'Немного знаю' },
            { value: 'intermediate', label: 'Разбираюсь посредственно' },
            { value: 'advanced', label: 'Имею фундаментальные знания' },
            { value: 'expert', label: 'Гений' }
        ];
        
        this.difficultyTimes = [
            { value: 'more3', label: 'Более 3 лет' },
            { value: '1to3', label: 'От 1 года до 3 лет' },
            { value: 'lastYear', label: 'Только последний год' },
            { value: 'recentTopics', label: 'Последние темы' }
        ];

        this.initializeQuiz();
        this.initEventListeners();
        this.initFormHandlers();
        this.updateProgressBar();
        this.updateSubtitle();
    }

    initializeQuiz() {
        this.hideAllSteps();
        
        const firstStep = document.querySelector('.quiz__step[data-step="1"]');
        if (firstStep) {
            firstStep.classList.add('active');
        }
        
        this.renderSubjects();

        this.renderKnowledgeLevels();
        
        this.renderDifficultyTimes();
    }
    
    updateSubtitle() {
        if (this.subtitleElement && this.currentStep <= this.stepTitles.length) {
            this.subtitleElement.textContent = this.stepTitles[this.currentStep - 1];
        }
    }
    
    initFormHandlers() {
        if (this.nameInput) {
            this.handlePlaceholder(this.nameInput);
        }
        
        if (this.phoneInput) {
            this.phoneInput.addEventListener('input', e => this.handlePhoneInput(e));
        }
    }
    
    handlePlaceholder(input) {
        const placeholder = input.nextElementSibling;
        if (!placeholder?.classList.contains('field__placeholder')) return;
        
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
        errorElement.className = 'field__error-quiz';
        errorElement.textContent = message;
        
        input.classList.add('field__control--error');
        parent.appendChild(errorElement);
    }
    
    removeError(input) {
        if (!input) return;
        
        const parent = input.closest('.field');
        if (!parent) return;
        
        const errorElement = parent.querySelector('.field__error-quiz');
        if (errorElement) errorElement.remove();
        
        input.classList.remove('field__control--error');
    }
    
    hideAllSteps() {
        this.steps?.forEach(step => {
            step.classList.remove('active');
        });
    }

    renderSubjects() {
        const subjectsContainer = document.getElementById('subjects-container');

        if (!subjectsContainer) return;
        subjectsContainer.innerHTML = '';
        this.subjects.forEach(subject => {
            const optionItem = document.createElement('div');
            optionItem.className = 'quiz__option-item';

            optionItem.innerHTML = `
                <label class="quiz__checkbox-container">
                    <input type="checkbox" class="quiz__checkbox-input" name="subject" value="${subject.value}">
                    <span class="quiz__custom-checkbox"></span>
                    <span class="quiz__option-label">${subject.label}</span>
                </label>
            `;

            subjectsContainer.appendChild(optionItem);
        });
    }

    renderKnowledgeLevels() {
        const knowledgeLevelContainer = document.getElementById('knowledge-level-container');

        if (!knowledgeLevelContainer) return;
        knowledgeLevelContainer.innerHTML = '';

        this.knowledgeLevels.forEach(level => {
            const optionItem = document.createElement('div');
            optionItem.className = 'quiz__option-item';

            optionItem.innerHTML = `
                <label class="quiz__radio-container">
                    <input type="radio" class="quiz__radio-input" name="knowledgeLevel" value="${level.value}">
                    <span class="quiz__custom-radio"></span>
                    <span class="quiz__option-label">${level.label}</span>
                </label>
            `;

            knowledgeLevelContainer.appendChild(optionItem);
        });
    }
    
    renderDifficultyTimes() {
        const difficultyTimesContainer = document.getElementById('difficulty-time-container');

        if (!difficultyTimesContainer) return;

        difficultyTimesContainer.innerHTML = '';

        this.difficultyTimes.forEach(item => {
            const optionItem = document.createElement('div');
            optionItem.className = 'quiz__option-item';

            optionItem.innerHTML = `
                <label class="quiz__radio-container">
                    <input type="radio" class="quiz__radio-input" name="difficultyTime" value="${item.value}">
                    <span class="quiz__custom-radio"></span>
                    <span class="quiz__option-label">${item.label}</span>
                </label>
            `;

            difficultyTimesContainer.appendChild(optionItem);
        });
    }

    initEventListeners() {
        const step1Button = document.getElementById('step1-button');
        const backToStep1Button = document.getElementById('back-to-step1');
        const step2Button = document.getElementById('step2-button');
        const backToStep2Button = document.getElementById('back-to-step2');
        const step3Button = document.getElementById('step3-button');
        const backToStep3Button = document.getElementById('back-to-step3');
        const step4Button = document.getElementById('step4-button');
        const restartButton = document.getElementById('restart-quiz');

        if (step1Button) {
            step1Button.addEventListener('click', () => {
                this.collectAnswers('subject');
                if (this.answers.subject.length > 0) {
                    this.goToStep(2);
                } else {
                    alert('Пожалуйста, выберите хотя бы один предмет');
                }
            });
        }

        if (backToStep1Button) {
            backToStep1Button.addEventListener('click', () => {
                this.goToStep(1);
            });
        }

        if (step2Button) {
            step2Button.addEventListener('click', () => {
                this.collectRadioAnswer('knowledgeLevel');
                if (this.answers.knowledgeLevel) {
                    this.goToStep(3);
                } else {
                    alert('Пожалуйста, оцените свой уровень знаний');
                }
            });
        }
        
        if (backToStep2Button) {
            backToStep2Button.addEventListener('click', () => {
                this.goToStep(2);
            });
        }
        
        if (step3Button) {
            step3Button.addEventListener('click', () => {
                this.collectRadioAnswer('difficultyTime');
                if (this.answers.difficultyTime) {
                    this.goToStep(4);
                } else {
                    alert('Пожалуйста, укажите как давно испытываете трудности');
                }
            });
        }
        
        if (backToStep3Button) {
            backToStep3Button.addEventListener('click', () => {
                this.goToStep(3);
            });
        }
        
        if (step4Button) {
            step4Button.addEventListener('click', () => {
                if (this.validateName() && this.validatePhone()) {
                    this.answers.contactInfo.name = this.nameInput.value;
                    this.answers.contactInfo.phone = this.phoneInput.value;
                    
                    this.renderResults();
                    this.goToStep(5);
                }
            });
        }
        
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                this.answers = {
                    subject: [],
                    knowledgeLevel: '',
                    difficultyTime: '',
                    contactInfo: {
                        name: '',
                        phone: ''
                    }
                };
                
                this.resetQuiz();
                this.goToStep(1);
            });
        }
    }
    
    resetQuiz() {
        document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        
        if (this.nameInput) {
            this.nameInput.value = '';
            const namePlaceholder = this.nameInput.nextElementSibling;
            if (namePlaceholder?.classList.contains('field__placeholder')) {
                namePlaceholder.style.opacity = '1';
            }
        }
        
        if (this.phoneInput) {
            this.phoneInput.value = '';
        }
        
        const resultsContainer = document.getElementById('quiz-results-container');
        if (resultsContainer) resultsContainer.innerHTML = '';
        
        if (this.nameInput) this.removeError(this.nameInput);
        if (this.phoneInput) this.removeError(this.phoneInput);
    }
    
    renderResults() {
        const resultsContainer = document.getElementById('quiz-results-container');
        
        if (!resultsContainer) return;
        
        const selectedSubjects = this.answers.subject.map(value => {
            const subject = this.subjects.find(s => s.value === value);
            return subject ? subject.label : value;
        });
        
        const knowledgeLevel = this.knowledgeLevels.find(level => level.value === this.answers.knowledgeLevel);
        
        const difficultyTime = this.difficultyTimes.find(time => time.value === this.answers.difficultyTime);
        
        const resultsHTML = `
            <p><img src="../images/checkbox.png" alt="">${selectedSubjects.join(', ')}</p>
            <p><img src="../images/checkbox.png" alt="">${knowledgeLevel ? knowledgeLevel.label : 'Не указано'}</p>
            <p><img src="../images/checkbox.png" alt="">${difficultyTime ? difficultyTime.label : 'Не указано'}</p>
        `;
        
        resultsContainer.innerHTML = resultsHTML;
    }

    collectAnswers(fieldName) {
        const checkboxes = document.querySelectorAll(`input[name="${fieldName}"]:checked`);
        this.answers[fieldName] = Array.from(checkboxes).map(checkbox => checkbox.value);
    }

    collectRadioAnswer(fieldName) {
        const selectedRadio = document.querySelector(`input[name="${fieldName}"]:checked`);
        this.answers[fieldName] = selectedRadio ? selectedRadio.value : '';
    }

    goToStep(step) {
        this.hideAllSteps();

        const nextStepElement = document.querySelector(`.quiz__step[data-step="${step}"]`);
        if (nextStepElement) {
            nextStepElement.classList.add('active');

            this.currentStep = step;
            this.updateProgressBar();
            this.updateSubtitle();
        }
    }

    updateProgressBar() {
        const progressContainer = this.progressBar?.parentElement;
        
        if (progressContainer) {
            if (this.currentStep >= 4) {
                progressContainer.style.display = 'none';
            } else {
                progressContainer.style.display = 'block';
            }
        }
        
        let progress;
        
        if (this.currentStep === 1) {
            progress = 10; 
        } else if (this.currentStep === 2) {
            progress = 45; 
        } else if (this.currentStep === 3) {
            progress = 80; 
        } else {
            progress = 100; 
        }
        
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});

export default Quiz;