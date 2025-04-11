export default class Review {
    constructor() {
        this.reviewsBody = document.querySelector('.reviews__body');
        if (!this.reviewsBody) return;
        
        this.items = document.querySelectorAll('.reviews__item');
        this.masonryInstance = null;
        this.maxTextLength = 100;
        this.mobileBreakpoint = 768;
        
        this.init();
    }
    
    init() {
        this.reviewsBody.classList.add('reviews__grid');
        this.cleanupStyles();
        this.saveOriginalTexts();
        this.createSizer();
        this.setupReviewTexts();
        this.masonryInstance = this.initMasonry();
        this.setupMobileScrolling();
        window.addEventListener('resize', () => this.handleResize());
    }
    
    cleanupStyles() {
        this.items.forEach(item => {
            item.style.marginTop = '';
            item.style.marginBottom = '';
            item.style.height = '';
        });
    }
    
    saveOriginalTexts() {
        this.items.forEach(item => {
            const content = item.querySelector('.reviews__content');
            if (content && !content.getAttribute('data-original-text')) {
                content.setAttribute('data-original-text', content.textContent);
            }
        });
    }
    
    createSizer() {
        const sizer = document.createElement('div');
        sizer.className = 'reviews__sizer';
        this.reviewsBody.prepend(sizer);
    }
    
    setupReviewTexts() {
        this.items.forEach(item => {
            const content = item.querySelector('.reviews__content');
            if (!content || !content.getAttribute('data-original-text')) return;
            
            const originalText = content.getAttribute('data-original-text');
            
            if (this.isMobile()) {
                this.truncateTextForMobile(content, originalText);
            } else {
                this.restoreFullText(content, originalText);
            }
        });
    }
    
    truncateTextForMobile(content, originalText) {
        const existingLink = content.querySelector('.reviews__read-more');
        if (existingLink) existingLink.remove();
        
        if (originalText.length > this.maxTextLength) {
            content.textContent = originalText.substring(0, this.maxTextLength).trim();
            content.classList.add('truncated');
            
            const readMoreLink = document.createElement('a');
            readMoreLink.className = 'reviews__read-more';
            readMoreLink.textContent = '... Читать ещё';
            readMoreLink.href = '';
            readMoreLink.target = '_blank';
            content.appendChild(readMoreLink);
        } else {
            this.restoreFullText(content, originalText);
        }
    }
    
    restoreFullText(content, originalText) {
        content.textContent = originalText;
        content.classList.remove('truncated');
    }
    
    isMobile() {
        return window.innerWidth <= this.mobileBreakpoint;
    }
    
    initMasonry() {
        if (this.isMobile()) return null;
        
        const masonry = new Masonry(this.reviewsBody, {
            itemSelector: '.reviews__item',
            columnWidth: '.reviews__sizer',
            percentPosition: true,
            gutter: 12,
            horizontalOrder: false,
            fitWidth: false
        });
        
        imagesLoaded(this.reviewsBody).on('progress', () => masonry.layout());
        
        return masonry;
    }
    
    setupMobileScrolling() {
        if (this.isMobile()) {
            if (this.items.length && !this.reviewsBody.querySelector('.mobile-spacer')) {
                const spacer = document.createElement('div');
                spacer.className = 'mobile-spacer';
                spacer.style.minWidth = '16px';
                spacer.style.height = '1px';
                spacer.style.flexShrink = '0';
                this.reviewsBody.appendChild(spacer);
            }
        } else {
            const spacer = this.reviewsBody.querySelector('.mobile-spacer');
            if (spacer) spacer.remove();
        }
    }
    
    handleResize() {
        this.setupReviewTexts();
        
        if (this.masonryInstance) {
            this.masonryInstance.destroy();
            this.masonryInstance = null;
        }
        
        this.setupMobileScrolling();
        this.masonryInstance = this.initMasonry();
    }
}

document.addEventListener('DOMContentLoaded', () => new Review());