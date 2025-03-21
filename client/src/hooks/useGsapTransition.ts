import { useEffect } from "react";
import gsap from "gsap";

export function useGsapTransition() {
  useEffect(() => {
    // Create GSAP transition element
    const transitionDiv = document.createElement('div');
    transitionDiv.className = 'fixed top-0 left-0 w-full h-full bg-primary-500 z-[9999]';
    transitionDiv.style.transform = 'translateY(100%)';
    document.body.appendChild(transitionDiv);
    
    // Animate the page transition
    gsap.to(transitionDiv, {
      y: '-100%',
      duration: 0.8,
      ease: 'power3.inOut',
      delay: 0.1,
      onComplete: () => {
        transitionDiv.remove();
      }
    });
    
    return () => {
      if (document.body.contains(transitionDiv)) {
        document.body.removeChild(transitionDiv);
      }
    };
  }, []);
}
