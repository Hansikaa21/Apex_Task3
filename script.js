// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initQuiz();
    initCarousel();
    initWeatherAPI();
    initJokeAPI();
});

// Navigation Functions
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Quiz Functions
function initQuiz() {
    const quizData = [
        {
            question: "What does CSS stand for?",
            options: [
                "Computer Style Sheets",
                "Cascading Style Sheets",
                "Creative Style Sheets",
                "Colorful Style Sheets"
            ],
            correct: 1
        },
        {
            question: "Which HTML tag is used for the largest heading?",
            options: ["<h6>", "<heading>", "<h1>", "<header>"],
            correct: 2
        },
        {
            question: "What is the correct way to declare a JavaScript variable?",
            options: [
                "variable carName;",
                "var carName;",
                "v carName;",
                "declare carName;"
            ],
            correct: 1
        },
        {
            question: "Which CSS property is used to change the text color?",
            options: ["text-color", "font-color", "color", "text-style"],
            correct: 2
        },
        {
            question: "What does API stand for?",
            options: [
                "Application Programming Interface",
                "Automated Program Integration",
                "Advanced Programming Instructions",
                "Application Process Integration"
            ],
            correct: 0
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let selectedAnswer = null;

    const quizStart = document.getElementById('quiz-start');
    const quizGame = document.getElementById('quiz-game');
    const quizResults = document.getElementById('quiz-results');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const questionCounter = document.getElementById('question-counter');
    const progressFill = document.getElementById('progress-fill');
    const scoreDisplay = document.getElementById('score-display');

    startQuizBtn.addEventListener('click', startQuiz);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    restartQuizBtn.addEventListener('click', restartQuiz);

    function startQuiz() {
        currentQuestion = 0;
        score = 0;
        selectedAnswer = null;
        
        quizStart.classList.add('hidden');
        quizGame.classList.remove('hidden');
        
        displayQuestion();
    }

    function displayQuestion() {
        const question = quizData[currentQuestion];
        
        // Update progress
        const progress = ((currentQuestion + 1) / quizData.length) * 100;
        progressFill.style.width = progress + '%';
        questionCounter.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
        
        // Display question
        questionText.textContent = question.question;
        
        // Clear previous options
        answerOptions.innerHTML = '';
        
        // Create option buttons
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('div');
            optionBtn.className = 'answer-option';
            optionBtn.textContent = option;
            optionBtn.addEventListener('click', () => selectAnswer(index, optionBtn));
            answerOptions.appendChild(optionBtn);
        });
        
        nextQuestionBtn.classList.add('hidden');
        selectedAnswer = null;
    }

    function selectAnswer(answerIndex, optionElement) {
        // Remove previous selections
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Select current option
        optionElement.classList.add('selected');
        selectedAnswer = answerIndex;
        
        // Show feedback immediately
        const question = quizData[currentQuestion];
        const isCorrect = answerIndex === question.correct;
        
        // Add visual feedback
        document.querySelectorAll('.answer-option').forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === answerIndex && !isCorrect) {
                option.classList.add('incorrect');
            }
            
            // Disable further clicking
            option.style.pointerEvents = 'none';
        });
        
        if (isCorrect) {
            score++;
        }
        
        // Show next button after a short delay
        setTimeout(() => {
            nextQuestionBtn.classList.remove('hidden');
        }, 1000);
    }

    function nextQuestion() {
        currentQuestion++;
        
        if (currentQuestion < quizData.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        quizGame.classList.add('hidden');
        quizResults.classList.remove('hidden');
        
        const percentage = Math.round((score / quizData.length) * 100);
        let message = '';
        
        if (percentage >= 80) {
            message = '🎉 Excellent! You\'re a web development expert!';
        } else if (percentage >= 60) {
            message = '👍 Good job! You have solid knowledge.';
        } else if (percentage >= 40) {
            message = '📚 Not bad, but there\'s room for improvement.';
        } else {
            message = '💪 Keep learning! Practice makes perfect.';
        }
        
        scoreDisplay.innerHTML = `
            <div class="score-circle">
                <h2>${score}/${quizData.length}</h2>
                <p>${percentage}%</p>
            </div>
            <p class="score-message">${message}</p>
        `;
    }

    function restartQuiz() {
        quizResults.classList.add('hidden');
        quizStart.classList.remove('hidden');
        
        // Reset all option styles
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
            option.style.pointerEvents = 'auto';
        });
    }
}

// Carousel Functions
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentSlide = 0;
    let autoSlideInterval;

    // Navigation event listeners
    prevBtn.addEventListener('click', () => changeSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => changeSlide(currentSlide + 1));

    // Indicator event listeners
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => changeSlide(index));
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    const carousel = document.querySelector('.carousel');

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    // Mouse drag support for desktop
    let isDragging = false;
    
    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        carousel.style.cursor = 'grabbing';
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    carousel.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        endX = e.clientX;
        carousel.style.cursor = 'grab';
        handleSwipe();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(currentSlide + 1);
        }
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next slide
                changeSlide(currentSlide + 1);
            } else {
                // Swiped right - previous slide
                changeSlide(currentSlide - 1);
            }
        }
    }

    function changeSlide(newSlide) {
        // Handle wrap-around
        if (newSlide >= slides.length) {
            newSlide = 0;
        } else if (newSlide < 0) {
            newSlide = slides.length - 1;
        }

        // Remove active class from current slide and indicator
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');

        // Add active class to new slide and indicator
        currentSlide = newSlide;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');

        // Reset auto-slide timer
        resetAutoSlide();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            changeSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Pause auto-slide when hovering
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Start auto-slide
    startAutoSlide();

    // Pause auto-slide when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });
}

// Weather API Functions
function initWeatherAPI() {
    const cityInput = document.getElementById('city-input');
    const getWeatherBtn = document.getElementById('get-weather-btn');
    const weatherInfo = document.getElementById('weather-info');
    const loading = document.getElementById('loading');

    getWeatherBtn.addEventListener('click', getWeather);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            getWeather();
        }
    });

    async function getWeather() {
        const city = cityInput.value.trim();
        
        if (!city) {
            showError('Please enter a city name');
            return;
        }

        showLoading();

        try {
            // Using OpenWeatherMap API (you'll need to get a free API key)
            // For demo purposes, we'll use a mock API or public weather service
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`);
            
            // Since we don't have a real API key, let's simulate with a public service
            // Using wttr.in which provides weather data in JSON format
            const weatherResponse = await fetch(`https://wttr.in/${city}?format=j1`);
            
            if (!weatherResponse.ok) {
                throw new Error('City not found');
            }

            const data = await weatherResponse.json();
            displayWeather(data, city);
            
        } catch (error) {
            // If the API fails, show mock data for demonstration
            console.log('API failed, showing mock data:', error);
            showMockWeather(city);
        }
    }

    function displayWeather(data, city) {
        hideLoading();
        
        const current = data.current_condition[0];
        const location = data.nearest_area[0];
        
        weatherInfo.innerHTML = `
            <div class="weather-summary">
                <h3>${location.areaName[0].value}, ${location.country[0].value}</h3>
                <div class="temperature">${current.temp_C}°C / ${current.temp_F}°F</div>
                <div class="description">${current.weatherDesc[0].value}</div>
            </div>
            <div class="weather-details">
                <div class="weather-item">
                    <h4>Feels Like</h4>
                    <p>${current.FeelsLikeC}°C</p>
                </div>
                <div class="weather-item">
                    <h4>Humidity</h4>
                    <p>${current.humidity}%</p>
                </div>
                <div class="weather-item">
                    <h4>Wind Speed</h4>
                    <p>${current.windspeedKmph} km/h</p>
                </div>
                <div class="weather-item">
                    <h4>Visibility</h4>
                    <p>${current.visibility} km</p>
                </div>
            </div>
        `;
    }

    function showMockWeather(city) {
        hideLoading();
        
        // Generate random but realistic weather data for demo
        const temps = [15, 18, 22, 25, 28, 30, 12, 8, 35];
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
        const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
        const windSpeed = Math.floor(Math.random() * 20) + 5; // 5-25 km/h
        
        const temp = temps[Math.floor(Math.random() * temps.length)];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const tempF = Math.round((temp * 9/5) + 32);
        
        weatherInfo.innerHTML = `
            <div class="weather-summary">
                <h3>${city}</h3>
                <div class="temperature">${temp}°C / ${tempF}°F</div>
                <div class="description">${condition}</div>
                <small style="color: #666; font-style: italic;">Demo data - Get a real API key for live weather</small>
            </div>
            <div class="weather-details">
                <div class="weather-item">
                    <h4>Feels Like</h4>
                    <p>${temp + Math.floor(Math.random() * 6) - 3}°C</p>
                </div>
                <div class="weather-item">
                    <h4>Humidity</h4>
                    <p>${humidity}%</p>
                </div>
                <div class="weather-item">
                    <h4>Wind Speed</h4>
                    <p>${windSpeed} km/h</p>
                </div>
                <div class="weather-item">
                    <h4>Visibility</h4>
                    <p>${Math.floor(Math.random() * 15) + 5} km</p>
                </div>
            </div>
        `;
    }

    function showError(message) {
        hideLoading();
        weatherInfo.innerHTML = `
            <div class="error-message" style="color: #e74c3c; text-align: center; padding: 1rem;">
                <h4>Error</h4>
                <p>${message}</p>
            </div>
        `;
    }

    function showLoading() {
        loading.classList.remove('hidden');
        weatherInfo.innerHTML = '';
    }

    function hideLoading() {
        loading.classList.add('hidden');
    }
}

// Joke API Functions
function initJokeAPI() {
    const getJokeBtn = document.getElementById('get-joke-btn');
    const jokeText = document.getElementById('joke-text');

    getJokeBtn.addEventListener('click', getJoke);

    // Get a joke on page load
    getJoke();

    async function getJoke() {
        jokeText.textContent = 'Loading joke...';
        getJokeBtn.disabled = true;

        try {
            // Try to fetch from JokesAPI
            const response = await fetch('https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single');
            
            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            if (data.joke) {
                jokeText.textContent = data.joke;
            } else {
                throw new Error('No joke found');
            }
            
        } catch (error) {
            // If API fails, use local jokes
            console.log('Joke API failed, using local jokes:', error);
            const localJokes = [
                "Why do programmers prefer dark mode? Because light attracts bugs!",
                "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
                "Why do Java developers wear glasses? Because they can't C#!",
                "What's a programmer's favorite hangout place? Foo Bar!",
                "Why did the programmer quit his job? He didn't get arrays!",
                "What do you call a programmer from Finland? Nerdic!",
                "Why do programmers always mix up Halloween and Christmas? Because Oct 31 equals Dec 25!",
                "What's the object-oriented way to become wealthy? Inheritance!",
                "Why don't programmers like nature? It has too many bugs!",
                "How do you comfort a JavaScript bug? You console it!"
            ];
            
            const randomJoke = localJokes[Math.floor(Math.random() * localJokes.length)];
            jokeText.textContent = randomJoke;
        } finally {
            getJokeBtn.disabled = false;
        }
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if supported
if ('IntersectionObserver' in window) {
    lazyLoadImages();
}

// Add smooth scroll behavior for older browsers
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add resize listener for responsive adjustments
window.addEventListener('resize', debounce(() => {
    // Recalculate carousel dimensions if needed
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        // Force redraw to handle responsive changes
        carousel.style.display = 'none';
        carousel.offsetHeight; // Trigger reflow
        carousel.style.display = '';
    }
}, 250));

// Add scroll effect for header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(102, 126, 234, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        header.style.backdropFilter = 'none';
    }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}