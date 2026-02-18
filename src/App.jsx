import { useRef, useEffect } from 'react';
import './App.css';
import { FaPlus } from "react-icons/fa";
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText);

function App() {
  const canvasRef = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = '/images/me.jpg';

    const state = { val: -0.1 };

    const sizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width  = Math.round(rect.width  * dpr);
      canvas.height = Math.round(rect.height * dpr);

      ctx.scale(dpr, dpr);
    };

    const render = () => {
      if (!img.complete) return;

      const dpr = window.devicePixelRatio || 1;

      const w = canvas.width  / dpr;
      const h = canvas.height / dpr;

      const maxCols = 20;
      const cols = Math.floor(10 + (maxCols - 10) * state.val);
      const rows = Math.ceil(h / (w / cols));

      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(img, 0, 0, cols, rows);
      ctx.drawImage(canvas, 0, 0,
        cols * dpr, rows * dpr,
        0, 0, w, h
      );

      if (state.val === 1) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
      }
    };

    const onEnter = () => {
      gsap.to(state, { val: -0.1, duration: 0.8, ease: "steps(3)", onUpdate: render });
    };

    const onLeave = () => {
      gsap.to(state, { val: 1, duration: 0.8, ease: "steps(3)", onUpdate: render });
    };

    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      canvas.style.width  = '20vw';
      canvas.style.height = `${20 / aspectRatio}vw`;

      requestAnimationFrame(() => {
        sizeCanvas();
        render();
        onLeave();
      });

      canvas.addEventListener('mouseover', onEnter);
      canvas.addEventListener('mouseout',  onLeave);
    };

    const handleResize = () => {
      sizeCanvas();
      render();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      canvas.removeEventListener('mouseover', onEnter);
      canvas.removeEventListener('mouseout',  onLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useGSAP(() => {
    if (!container.current) return;

    const meEl   = container.current.querySelector('.me-text');
    const openEl = container.current.querySelector('.open-text');

    const meSplit   = SplitText.create(meEl,   { type: 'lines', linesClass: 'split-line' });
    const openSplit = SplitText.create(openEl, { type: 'lines', linesClass: 'split-line' });

    [...meSplit.lines, ...openSplit.lines].forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'overflow:hidden; display:block;';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    const fromVars = {
      y: '105%',
      skewY: 6,
      transformOrigin: 'left bottom',
    };

    gsap.set(meSplit.lines,   fromVars);
    gsap.set(openSplit.lines, fromVars);

    const tl = gsap.timeline({ delay: 0.15 });

    tl.to(meSplit.lines, {
      y: '0%',
      skewY: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.12,
    });

    tl.to(openSplit.lines, {
      y: '0%',
      skewY: 0,
      duration: 0.65,
      ease: 'power3.out',
      stagger: 0.1,
      onComplete: () => {
      const arrow   = container.current.querySelector('.text-contact-arrow');
      const contact = container.current.querySelector('.text-contact');

      gsap.to([arrow, contact], {
      opacity: 1,
      duration: 0.15,
      ease: "power1.in",
      stagger: 0.1,
      });

    contact.addEventListener('mouseenter', () => {
    gsap.to(contact, { opacity: 0.25, duration: 0.2, ease: 'power1.out' });
    });
    contact.addEventListener('mouseleave', () => {
    gsap.to(contact, { opacity: 1, duration: 0.2, ease: 'power1.out' });
  });
}
    }, '+=0.15');

    return () => {
      meSplit.revert();
      openSplit.revert();
    };
  }, { scope: container });

  return (
    <div ref={container} className="relative container h-screen min-w-screen grid grid-rows-3 justify-center bg-white overflow-x-hidden">

      <div className="relative flex flex-col">
        <div className="lg:w-1/2 w-2/3 relative intro-text p-4">
          <span aria-hidden="true" className="block w-full font-geist font-normal
            text-[14px] md:text-[18px] lg:text-[28px]
            leading-4 md:leading-6.5 lg:leading-8.5 -tracking-[6%]
            text-left invisible select-none">
            Haseeb Ahmad is a Creative Frontend Developer based in Pakistan. He builds custom-coded websites for agencies and brands — bringing design concepts to life while handling the technical side so creative teams can focus on what they do best.
          </span>
          <span className="me-text absolute top-0 left-0 p-4 block w-full font-geist font-normal
            text-[14px] md:text-[18px] lg:text-[28px]
            leading-4 md:leading-6.5 lg:leading-8.5 -tracking-[6%]
            text-left text-black overflow-clip">
            Haseeb Ahmad is a Creative Frontend Developer based in Pakistan. He builds custom-coded websites for agencies and brands — bringing design concepts to life while handling the technical side so creative teams can focus on what they do best.
          </span>
        </div>
      </div>

      <div className="flex items-center justify-items-center">
        <canvas ref={canvasRef} className="h-full w-full pixel-canvas mx-auto scale-260 md:scale-220 lg:scale-115" />
      </div>

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

          <div className="relative">
            <span aria-hidden="true" className="block invisible select-none whitespace-nowrap">
              Open for Freelance Opportunities & Collaborations
            </span>
            <span className="open-text absolute bottom-[9vh] md:bottom-[5vh] left-0 block whitespace-nowrap">
              Open for Freelance Opportunities & Collaborations
            </span>
          </div>

          <div className="flex flex-row gap-1.25 absolute bottom-[8.5vh] md:bottom-[3vh]">
            <span className='text-contact-arrow opacity-0'>→</span>
            <a href="mailto:haseebhasan353@gmail.com" 
            className="text-contact underline tracking-normal opacity-0 hover:opacity-25">
              Contact Me
            </a>
          </div>
        </div>
      </div>

      <FaPlus className="absolute top-1/2 left-1/2 transform -translate-x-3 -translate-y-1/2 text-yellow-500 text-xs" />
    </div>
  );
}

export default App;