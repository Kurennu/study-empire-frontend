class CourseCards {
    selectors = {
        root: '[data-js-courses]',
        card: '[data-js-course-card]',
        description: '[data-js-course-description]',
        modal: '[data-js-course-modal]',
        modalContent: '[data-js-course-modal-content]',
        modalClose: '[data-js-course-modal-close]',
    }

    stateClasses = {
        isActive: 'is-active',
        isCollapsed: 'is-collapsed',
        isLock: 'is-lock',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        if (!this.rootElement) return

        this.cards = this.rootElement.querySelectorAll(this.selectors.card)
        this.modal = document.querySelector(this.selectors.modal)
        this.modalContent = this.modal?.querySelector(this.selectors.modalContent)
        this.modalCloseButtons = document.querySelectorAll(this.selectors.modalClose)
        
        this.isMobile = window.innerWidth < 768
        
        this.init()
        this.bindEvents()
    }

    init() {
        if (this.isMobile) {
            this.collapseDescriptions()
        }
    }

    collapseDescriptions() {
        this.cards.forEach(card => {
            const description = card.querySelector(this.selectors.description)
            if (description) {
                const originalText = description.textContent.trim()
                description.dataset.originalText = originalText
                description.textContent = 'Подробнее'
                description.classList.add(this.stateClasses.isCollapsed)
            }
        })
    }

    expandDescriptions() {
        this.cards.forEach(card => {
            const description = card.querySelector(this.selectors.description)
            if (description && description.dataset.originalText) {
                description.textContent = description.dataset.originalText
                description.classList.remove(this.stateClasses.isCollapsed)
            }
        })
    }

    openModal(card) {
        if (!this.modal || !this.modalContent) return
        
        const clonedCard = card.cloneNode(true)
        const description = clonedCard.querySelector(this.selectors.description)
        
        if (description && description.dataset.originalText) {
            description.textContent = description.dataset.originalText
            description.classList.remove(this.stateClasses.isCollapsed)
        }
        
        this.modalContent.innerHTML = ''
        this.modalContent.appendChild(clonedCard)
        this.modal.classList.add(this.stateClasses.isActive)
        document.documentElement.classList.add(this.stateClasses.isLock)
    }

    closeModal() {
        if (!this.modal) return
        
        this.modal.classList.remove(this.stateClasses.isActive)
        document.documentElement.classList.remove(this.stateClasses.isLock)
    }

    handleCardClick = (event) => {
        if (!this.isMobile) return
        
        const description = event.target.closest(this.selectors.description)
        if (!description || !description.classList.contains(this.stateClasses.isCollapsed)) return
        
        const card = event.currentTarget
        this.openModal(card)
    }

    handleCloseModal = () => {
        this.closeModal()
    }

    handleWindowResize = () => {
        const wasMobile = this.isMobile
        this.isMobile = window.innerWidth < 768
        
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.collapseDescriptions()
            } else {
                this.expandDescriptions()
            }
        }
    }

    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('click', this.handleCardClick)
        })
        
        this.modalCloseButtons.forEach(button => {
            button.addEventListener('click', this.handleCloseModal)
        })
        
        window.addEventListener('resize', this.handleWindowResize)
    }
}

export default CourseCards 