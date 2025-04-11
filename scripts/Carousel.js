class Carousel {
    constructor() {
        this.carousel = document.querySelector('.carousel__track');
        if (!this.carousel) return;
        this.init();
    }

    init() {
        const speed = 0.1;
        let offset = 0;
        let animationId;

        const clone = this.carousel.innerHTML;
        this.carousel.innerHTML += clone;

        const animate = () => {
            offset -= speed;
            if (Math.abs(offset) >= this.carousel.scrollWidth / 2) {
                offset = 0;
            }
            this.carousel.style.transform = `translateX(${offset}px)`;
            animationId = requestAnimationFrame(animate);
        };

        setTimeout(() => {
            animationId = requestAnimationFrame(animate);
        }, 100);

        this.carousel.addEventListener('mouseenter', () => {
            cancelAnimationFrame(animationId);
        });

        this.carousel.addEventListener('mouseleave', () => {
            animationId = requestAnimationFrame(animate);
        });
    }
}

export default Carousel;
