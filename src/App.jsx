import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './App.css';
import { FaPlus } from "react-icons/fa";

function App() {
  const canvasRef = useRef(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = '/images/me.jpeg'; 

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
    
    if (state.val === 1) {
      ctx.drawImage(img, 0, 0, w, h);
    }
  };

  const onEnter = () => {
    gsap.to(state, {
      val: 0, 
      duration: 0.8,
      ease: "steps(3)",
      onUpdate: render,
    });
  };

  const onLeave = () => {
    gsap.to(state, {
      val: 1, 
      ease: "steps(3)",
      duration: 0.8,
      onUpdate: render,
    });
  };

  img.onload = () => {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    canvas.style.width = '20vw';
    canvas.style.height = `${20 / aspectRatio}vw`;
    
    render();
    onLeave(); 

    canvas.addEventListener('mouseover', onEnter);
    canvas.addEventListener('mouseout', onLeave);
  };

  return () => {
    canvas.removeEventListener('mouseover', onEnter);
    canvas.removeEventListener('mouseout', onLeave);
  };
}, []);

  return (
    <div className="relative container h-screen min-w-screen grid grid-rows-3 justify-center bg-white">
      <div className="relative flex flex-col">
        <div className="h-1/2 w-1/2 intro-text p-4 font-geist font-normal text-[10px] md:text-[14px] lg:text-[20px] text-left text-black">
        Haseeb Ahmad is a Creative Frontend Developer based in Pakistan. He builds custom-coded websites for agencies and brands — bringing design concepts to life while handling the technical side so creative teams can
        focus on what they do best.
      </div>
      <div className='h-1/2 w-1/2'></div>
      </div>
      <div className="flex items-center justify-items-center">
      <canvas ref={canvasRef} className="h-full w-full pixel-canvas mx-auto"></canvas>
      </div>
      <div className='relative flex flex-row'>
  <div className='h-full flex-1 font-geist font-normal text-[6px] md:text-[8px] lg:text-[14px] text-gray-400 flex items-end p-4'>
    Designed by <span className='w-1' /> <a href="https://hasnainkhagan.com" className="underline">Hasnain Khan</a>
  </div>

  <div className="h-full font-geist font-normal text-[10px] md:text-[14px] lg:text-[20px] text-black flex flex-col items-start justify-end p-4">
    <span>Open for Freelance Opportunities & Collaborations</span>
    <div className="flex flex-row gap-1.25">
      <span>→</span>
      <a href="mailto:haseebhasan353@gmail.com" className="underline tracking-normal">
       Contact Me
    </a>
    </div>
  </div>
</div>
      <FaPlus className="absolute top-1/2 left-1/2 transform -translate-x-2 -translate-y-1/2 text-red-400 text-xs" />
    </div>
  );
}

export default App;

//