import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  isLoading = false;
  lastScrollPosition = 0;
  currentPairIndex = 0;

  constructor(
    public router: Router,
    public accountService: AccountService
  ) {}

  beforeAfterPairs = [
    {
      before: './../../assets/before.jpg',
      after: './../../assets/after.jpg',
      prompt: 'Transform a simple sketch into a detailed artwork'
    },
    {
      before: './../../assets/before2.jpg',
      after: './../../assets/after2.jpg',
      prompt: 'Convert a basic landscape into a magical scene'
    },
    {
      before: './../../assets/before3.jpg',
      after: './../../assets/after3.jpg',
      prompt: 'Enhance portrait photography with artistic effects'
    },
    {
      before: './../../assets/before4.jpg',
      after: './../../assets/after4.jpg',
      prompt: 'Turn simple shapes into complex designs'
    }
  ];

  nextImage() {
    this.currentPairIndex = (this.currentPairIndex + 1) % this.beforeAfterPairs.length;
  }

  previousImage() {
    this.currentPairIndex = (this.currentPairIndex - 1 + this.beforeAfterPairs.length) % this.beforeAfterPairs.length;
  }

  get currentPair() {
    return this.beforeAfterPairs[this.currentPairIndex];
  }

  async navigateToGenerate() {
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      if (!this.accountService.currentUserName) {
        // If not logged in, navigate to auth page
        await this.router.navigate(['/auth'], { queryParams: { mode: 'login' } });
      } else {
        // If logged in, navigate to generate image
        await this.router.navigate(['/generate-image']);
      }
    } finally {
      this.isLoading = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const currentScroll = window.pageYOffset;
    const scrollDirection = currentScroll > this.lastScrollPosition ? 'down' : 'up';

    // Parallax effect for cosmic particles
    document.querySelectorAll('.cosmic-particles').forEach((particle: Element) => {
      if (particle instanceof HTMLElement) {
        const speed = 0.5;
        const yPos = -(currentScroll * speed);
        particle.style.transform = `translateY(${yPos}px)`;
      }
    });

    // Enhance scroll reveal animations
    const animatedElements = document.querySelectorAll('.scroll-reveal:not(.show)');
    animatedElements.forEach((element: Element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const isVisible = elementTop < window.innerHeight - 100 && elementBottom > 0;

      if (isVisible) {
        element.classList.add('show');
        if (scrollDirection === 'down') {
          element.classList.add('scroll-up');
        } else {
          element.classList.add('scroll-down');
        }
      }
    });

    this.lastScrollPosition = currentScroll;
  }

  // Enhanced counter animation
  animateCounter(element: HTMLElement, target: number, duration: number = 2000) {
    const start = parseInt(element.innerText) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const updateCounter = () => {
      current += increment;
      if ((increment > 0 && current < target) || (increment < 0 && current > target)) {
        element.innerText = Math.round(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.innerText = target.toLocaleString();
      }
    };

    updateCounter();
  }

  statistics = [
    {
      value: 1000000,
      suffix: '+',
      label: 'Images Generated',
      icon: 'fas fa-images'
    },
    {
      value: 50000,
      suffix: '+',
      label: 'Happy Users',
      icon: 'fas fa-users'
    },
    {
      value: 95,
      suffix: '%',
      label: 'Success Rate',
      icon: 'fas fa-chart-line'
    },
    {
      value: 24,
      suffix: '/7',
      label: 'Support Available',
      icon: 'fas fa-headset'
    }
  ];

  aiFeatures = [
    {
      title: 'Smart Context Understanding',
      description: 'Advanced AI that understands complex prompts and context',
      icon: 'fas fa-brain'
    },
    {
      title: 'Style Transfer',
      description: 'Apply any artistic style to your generated images',
      icon: 'fas fa-paint-brush'
    },
    {
      title: 'High Resolution Output',
      description: 'Generate crystal clear images up to 4K resolution',
      icon: 'fas fa-expand'
    },
  ];

  styleExamples = [
    {
      name: 'Realistic',
      description: 'Photorealistic images with stunning detail',
      preview: 'assets/styles/realistic.jpg'
    },
    {
      name: 'Abstract',
      description: 'Bold, creative abstract compositions',
      preview: 'assets/styles/abstract.jpg'
    },
    {
      name: 'Anime',
      description: 'Japanese animation inspired artwork',
      preview: 'assets/styles/anime.jpg'
    },
    {
      name: 'Digital Art',
      description: 'Modern digital art with vibrant colors',
      preview: 'assets/styles/digital.jpg'
    }
  ];

  ngAfterViewInit() {
    // Enhanced Intersection Observer with threshold array
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');

          // Add extra animation class based on position
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          const elementPosition = rect.top + rect.height / 2;
          const viewportPosition = viewportHeight / 2;

          if (elementPosition < viewportPosition) {
            entry.target.classList.add('scroll-up');
          } else {
            entry.target.classList.add('scroll-down');
          }

          // Enhanced counter animation for statistics
          if (entry.target.classList.contains('stat-card')) {
            const counterElement = entry.target.querySelector('.counter');
            if (counterElement instanceof HTMLElement) {
              const target = parseInt(counterElement.getAttribute('data-target') || '0');
              this.animateCounter(counterElement, target);
            }
          }
        }
      });
    }, {
      threshold: [0.1, 0.5, 1.0],
      rootMargin: '-50px'
    });

    // Observe all animated elements
    document.querySelectorAll('.scroll-reveal, .process-step, .style-card, .stat-card, .ai-feature-card').forEach((element) => {
      observer.observe(element);
    });

    // Initialize before/after slider with enhanced touch support
    const sliderHandle = document.querySelector('.slider-handle') as HTMLElement;
    const beforeAfterCard = document.querySelector('.interactive-card') as HTMLElement;

    if (sliderHandle && beforeAfterCard) {
      let isDragging = false;
      let startX = 0;
      let sliderLeft = 0;

      const updateSlider = (clientX: number) => {
        const rect = beforeAfterCard.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        sliderHandle.style.left = `${x * 100}%`;
        beforeAfterCard.style.setProperty('--slider-position', `${x * 100}%`);
      };

      // Mouse events
      sliderHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - sliderHandle.offsetLeft;
      });

      // Touch events
      sliderHandle.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX - sliderHandle.offsetLeft;
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        updateSlider(e.clientX);
      });

      document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        updateSlider(e.touches[0].clientX);
      });

      document.addEventListener('mouseup', () => isDragging = false);
      document.addEventListener('touchend', () => isDragging = false);

      beforeAfterCard.addEventListener('click', (e: MouseEvent) => updateSlider(e.clientX));
    }

    // Initial animation trigger
    this.onScroll();
  }
}


