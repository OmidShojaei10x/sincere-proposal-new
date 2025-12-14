// Advanced Animations

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Number Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString('fa-IR');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString('fa-IR');
        }
    }, 16);
}

// Initialize counters when visible
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.target);
            animateCounter(counter, target);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(counter => {
    counterObserver.observe(counter);
});

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    document.querySelectorAll('.parallax').forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Smooth reveal on scroll
class ScrollReveal {
    constructor() {
        this.reveals = document.querySelectorAll('.reveal');
        this.init();
    }

    init() {
        this.reveals.forEach((element, index) => {
            element.style.transitionDelay = `${index * 0.1}s`;
        });

        window.addEventListener('scroll', () => this.checkReveals());
        this.checkReveals();
    }

    checkReveals() {
        this.reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('revealed');
            }
        });
    }
}

new ScrollReveal();

// Typewriter Effect
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Progress Bar Animation
function animateProgressBar(bar, percentage, duration = 1000) {
    let current = 0;
    const increment = percentage / (duration / 16);

    const timer = setInterval(() => {
        current += increment;
        if (current >= percentage) {
            bar.style.width = percentage + '%';
            clearInterval(timer);
        } else {
            bar.style.width = current + '%';
        }
    }, 16);
}

// Card Flip Animation
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

// Stagger Animation for Lists
function staggerAnimation(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('fade-in-up');
        }, index * delay);
    });
}

// Pulse Animation
function pulseElement(element, duration = 1000) {
    element.style.animation = `pulse ${duration}ms ease-in-out`;
    
    setTimeout(() => {
        element.style.animation = '';
    }, duration);
}

// Confetti Effect (for celebrations)
function createConfetti() {
    const colors = ['#fed813', '#f3c42e', '#2fbea8', '#3de19c', '#ffb113', '#fd6f95'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add to main.css for confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        top: -10px;
        z-index: 9999;
        animation: confetti-fall linear infinite;
    }

    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(confettiStyle);