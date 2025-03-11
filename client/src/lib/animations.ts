import { gsap } from "gsap";

// Page transition animation
export const pageTransition = (element: HTMLElement) => {
  return gsap.to(element, {
    y: '-100%',
    duration: 0.8,
    ease: 'power3.inOut',
    delay: 0.1,
  });
};

// Fade in animation
export const fadeIn = (element: HTMLElement) => {
  return gsap.from(element, {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out',
  });
};

// Stagger children animation
export const staggerChildren = (parentElement: HTMLElement, childSelector: string) => {
  const children = parentElement.querySelectorAll(childSelector);
  
  return gsap.from(children, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
  });
};

// Hover effect for exam cards
export const examCardHover = (element: HTMLElement) => {
  element.addEventListener('mouseenter', () => {
    gsap.to(element, {
      y: -5,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      duration: 0.3,
    });
  });
  
  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      y: 0,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
    });
  });
};

// Neon button effect
export const neonButtonEffect = (element: HTMLElement, color: string = 'rgba(99, 102, 241, 0.8)') => {
  element.addEventListener('mouseenter', () => {
    gsap.to(element, {
      boxShadow: `0 0 15px ${color}`,
      duration: 0.3,
    });
  });
  
  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      boxShadow: 'none',
      duration: 0.3,
    });
  });
};
