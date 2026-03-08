import React, { useState, useEffect, useRef } from 'react';

const NotFoundPage = () => {
  const pupilRef = useRef(null);
  const containerRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });

  const [blink, setBlink] = useState(false);

  // Smooth Eye Tracking (Physics-based LERP)
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      if (!containerRef.current || !pupilRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mouse.current.x - centerX;
      const dy = mouse.current.y - centerY;

      const angle = Math.atan2(dy, dx);
      const maxDistance = 14;

      const targetX = Math.cos(angle) * maxDistance;
      const targetY = Math.sin(angle) * maxDistance;

      position.current.x += (targetX - position.current.x) * 0.08;
      position.current.y += (targetY - position.current.y) * 0.08;

      pupilRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Natural Blink
  useEffect(() => {
    const blinkLoop = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
      setTimeout(blinkLoop, 3500 + Math.random() * 2000);
    };

    blinkLoop();
  }, []);

  return (
    <div
      className="error-page min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden"
      style={{
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: '-0.04em',
      }}
    >
      {/* Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;900&display=swap');`}</style>

      {/* 404 Section */}
      <div className="flex items-center justify-center leading-[0.8] select-none">
        {/* 4 Left */}
        <h1 className="text-[140px] md:text-[260px] font-black italic tracking-tighter">4</h1>

        {/* 0 with Eye */}
        <div className="relative mx-6">
          <div
            ref={containerRef}
            className="relative w-[110px] h-[150px] md:w-[180px] md:h-[240px]
                       rounded-full border-[18px] md:border-[28px] border-white
                       flex items-center justify-center"
          >
            <div
              className={`relative w-[70px] h-[40px] md:w-[110px] md:h-[65px]
                          bg-white rounded-full flex items-center justify-center
                          overflow-hidden transition-all duration-150
                          ${blink ? 'scale-y-0' : 'scale-y-100'}`}
              style={{
                boxShadow: 'inset 0 6px 12px rgba(0,0,0,0.25), inset 0 -6px 12px rgba(0,0,0,0.2)',
              }}
            >
              <div ref={pupilRef} className="w-6 h-6 md:w-10 md:h-10 bg-black rounded-full relative">
                <div className="absolute top-1 left-1 w-2 h-2 md:w-3 md:h-3 bg-white rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Right */}
        <h1 className="text-[140px] md:text-[260px] font-black italic tracking-tighter">4</h1>
      </div>

      {/* Minimal Text */}
      <div className="mt-6 text-center uppercase">
        <h2 className="text-lg md:text-2xl font-light tracking-wide">Sorry, there's</h2>
        <h2 className="text-lg md:text-2xl font-medium tracking-wide">Nothing here</h2>
      </div>

      {/* Minimal Button */}
      <button className="mt-10 rounded-xl border border-white px-6 py-2 text-sm font-light uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-black">Go Home</button>
    </div>
  );
};

export default NotFoundPage;
