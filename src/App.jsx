import { useRef, useState } from 'react';
import { useEffect } from 'react'
import './App.css'
import gsap from 'gsap';

function App() {

  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const canvas = ref.current;
    const cx = canvas.getContext('2d');

    const state = {
      pixel_Ratio: 0.065,
    }

    const img = new Image();
    img.src = '/images/me.jpeg';
   const render = () => {
    const { width, height } = canvas;
    const scaled_w = width * state.pixel_Ratio;
    const scaled_h = height * state.pixel_Ratio;

    cx.clearRect(0, 0, width, height);
    cx.imageSmoothingEnabled = false;

    cx.drawImage(img, 0, 0, scaled_w, scaled_h);

    const jitter = state.pixel_Ratio < 0.9 ? Math.random() * 10 : 0;
    
    cx.drawImage(canvas, 0, 0, scaled_w, scaled_h, -jitter, 0, width, height);

    cx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.085})`; 
    cx.fillRect(0, 0, width, height);
    
    cx.globalCompositeOperation = "source-over"; 
}
    img.onload = () => {

      canvas.addEventListener('mouseover', (e) => {
      gsap.to(state, {
        pixel_Ratio: 1,
        duration: 0.6,
        ease: "expo.in",
        onUpdate: render,
        force3D: true,
      });
    });

    canvas.addEventListener('mouseleave', (e) => {
      gsap.to(state, {
        pixel_Ratio: 0.065,
        duration: 0.6,
        ease: "expo.out",
        onUpdate: render,
        force3D: true,
      });
    });

          render();

    }

  }, []);

  return (
    <>
    <div className="container h-screen w-full flex items-center justify-center relative">
      <canvas ref={ref} className="pixel-canvas h-[60%] w-[35%] bg-blue-500"></canvas>
    </div>
    </>
  )
}

export default App
