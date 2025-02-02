import { useEffect } from 'react';

export default function DotBackground() {
  useEffect(() => {
    const canvas = document.getElementById('dotCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw dots
    const drawDots = () => {
      // Fill background with dark color
      ctx.fillStyle = '#09090b';  // Dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const spacing = 20;
      const dotSize = 1.5;
      
      // Create radial gradient for depth effect
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 2;
      
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          // Calculate distance from center for gradient effect
          const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          const opacity = Math.max(0.1, 0.3 * (1 - distance / maxDistance));
          
          ctx.beginPath();
          ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }
      }
      
      // Add radial gradient overlay for additional depth
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, maxDistance
      );
      gradient.addColorStop(0, 'rgba(9, 9, 11, 0)');
      gradient.addColorStop(1, 'rgba(9, 9, 11, 0.4)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    drawDots();
    window.addEventListener('resize', drawDots);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', drawDots);
    };
  }, []);

  return (
    <canvas
      id="dotCanvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  );
} 