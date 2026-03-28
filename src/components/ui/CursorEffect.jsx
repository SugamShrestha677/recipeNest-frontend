import React, { useEffect, useRef } from 'react';

const CursorEffect = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Create particles on move
      createParticle(mouseX, mouseY);
    };

    const createParticle = (x, y) => {
      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${4 + Math.random() * 6}px;
        height: ${4 + Math.random() * 6}px;
        background: radial-gradient(circle, rgba(249,115,22,0.8), rgba(249,115,22,0));
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        animation: particleFade 0.8s ease-out forwards;
      `;
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 800);
    };

    const animate = () => {
      // Smooth follow for main cursor
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;
      
      if (cursor) {
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      }
      if (cursorDot) {
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      }
      
      requestAnimationFrame(animate);
    };

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    const onElementHover = () => {
      if (cursor) cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(2.5)`;
      if (cursorDot) cursorDot.style.opacity = '0';
    };
    
    const onElementLeave = () => {
      if (cursor) cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
      if (cursorDot) cursorDot.style.opacity = '1';
    };

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onElementHover);
      el.addEventListener('mouseleave', onElementLeave);
    });

    document.addEventListener('mousemove', onMouseMove);
    animate();

    // Add styles for animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleFade {
        0% {
          opacity: 0.8;
          transform: scale(1);
        }
        100% {
          opacity: 0;
          transform: scale(0);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onElementHover);
        el.removeEventListener('mouseleave', onElementLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-12 h-12 pointer-events-none z-50 hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(249,115,22,0) 70%)',
          borderRadius: '50%',
          transition: 'transform 0.2s ease',
        }}
      />
      <div
        ref={cursorDotRef}
        className="fixed w-2 h-2 bg-orange-500 rounded-full pointer-events-none z-50 hidden md:block"
        style={{ transition: 'opacity 0.2s' }}
      />
    </>
  );
};

export default CursorEffect;