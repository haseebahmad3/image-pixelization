import { useRef, useEffect } from 'react';
import './App.css';
import { FaPlus } from "react-icons/fa";
import gsap from 'gsap';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrambleTextPlugin);

function App() {
  const canvasRef = useRef(null);
  const container = useRef(null);

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

  useGSAP(() => {
    if (!container.current) return;

    const scrambleConfig = {
      text: "{original}",
      chars: "lowerCase",
      revealDelay: 0.5,
      speed: 1.8,
    };

    gsap.timeline()
      .to(".me-text",   { duration: 2.5, scrambleText: scrambleConfig })
      .to(".open-text", { duration: 2.5, scrambleText: scrambleConfig }, "-=0.3");
  }, { scope: container });

  return (
    <div ref={container} className="relative container h-screen min-w-screen grid grid-rows-3 justify-center bg-white overflow-x-hidden">

      <div className="relative flex flex-col">
        <div className="w-1/2 relative intro-text p-4">
          <span aria-hidden="true" className="block w-full font-geist font-normal
            text-[14px] md:text-[18px] lg:text-[28px]
            leading-4 md:leading-6.5 lg:leading-8.5 -tracking-[5%]
            text-left invisible select-none">
            Haseeb Ahmad is a Creative Frontend Developer based in Pakistan. He builds custom-coded websites for agencies and brands — bringing design concepts to life while handling the technical side so creative teams can focus on what they do best.
          </span>
          <span className="me-text absolute top-0 left-0 p-4 block w-full font-geist font-normal
            text-[14px] md:text-[18px] lg:text-[28px]
            leading-4 md:leading-6.5 lg:leading-8.5 -tracking-[5%]
            text-left text-black w-block overflow-clip">
            Haseeb Ahmad is a Creative Frontend Developer based in Pakistan. He builds custom-coded websites for agencies and brands — bringing design concepts to life while handling the technical side so creative teams can focus on what they do best.
          </span>
        </div>
      </div>

      {/* ── ROW 2: Canvas ── */}
      <div className="flex items-center justify-items-center">
        <canvas ref={canvasRef} className="h-full w-full pixel-canvas mx-auto scale-260 md:scale-220 lg:scale-115"></canvas>
      </div>

      {/* ── ROW 3: Footer ── */}
      <div className='relative flex flex-row'>
        <div className='h-full hidden md:flex-1 font-geist font-normal
          text-[6px] md:text-[8px] lg:text-[14px]
          leading-4 md:leading-6.5 lg:leading-8.5 -tracking-[4%]
          text-gray-400 md:flex items-end p-4'>
          Designed by <span className='w-1' /> <a target='_blank' href="https://hasnainkhagan.com" className="underline">Hasnain Khan</a>
        </div>

        <div className="h-full font-geist font-normal
          text-[14px] md:text-[18px] lg:text-[28px]
          leading-4 md:leading-6.5 lg:leading-8.5 -tracking-[5%]
          text-black flex flex-col items-start justify-end p-4">

          {/* Ghost + animated layer for "Open for..." */}
          <div className="relative">
            {/* Ghost: holds the space, never touched by GSAP */}
            <span aria-hidden="true" className="block invisible select-none whitespace-nowrap">
              Open for Freelance Opportunities & Collaborations
            </span>
            {/* Animated span */}
            <span className="open-text absolute top-0 left-0 block whitespace-nowrap">
              Open for Freelance Opportunities & Collaborations
            </span>
          </div>

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