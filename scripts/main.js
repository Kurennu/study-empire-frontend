// Импорт компонентов
import Header from './Header.js'
import CourseCards from './CourseCards.js'
import Carousel from './Carousel.js'
import Review from './Review.js'
import Form from './Form.js'
import Quiz from './Quiz.js'

// Инициализация компонентов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Header()
    new CourseCards()
    new Carousel()
    new Review()
    new Form()
    // Quiz инициализируется внутри своего модуля при загрузке страницы
})