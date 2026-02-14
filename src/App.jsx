import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './App.css';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = '/images/me.jpeg'; 

    // 0 = super pixelated, 1 = less pixelated

    const state = { val: 0 };

    const render = () => {
      if (!img.complete) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const w = canvas.width;
      const h = canvas.height;

      const maxCols = 20; 
      const cols = Math.floor(10 + (maxCols - 10) * state.val);

      const s_size = w / cols;
      const rows = Math.ceil(h / s_size);

      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(img, 0, 0, cols, rows);

      ctx.drawImage(canvas, 0, 0, cols, rows, 0, 0, w, h);
    };

    const onEnter = () => {
      gsap.to(state, {
        val: 1, 
        ease: "steps(1.5)",
        duration: 0.8,
        onUpdate: render,
        onComplete: () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      });
    };

    const onLeave = () => {
        gsap.to(state, {
          val: 0.0,
          duration: 0.8,
          ease: "steps(3)",
          onUpdate: render,
        });
      };

    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;

      canvas.style.width = '35vw';
      canvas.style.height = `${35 / aspectRatio}vw`;
      
      render();
      canvas.addEventListener('mouseover', onEnter);
      canvas.addEventListener('mouseout', onLeave);
    };

    return () => {
      canvas.removeEventListener('mouseover', onEnter);
      canvas.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <div className="container h-screen w-full flex items-center justify-center bg-black">
      <canvas ref={canvasRef} className="pixel-canvas"></canvas>
    </div>
  );
}

export default App;