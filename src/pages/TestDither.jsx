import React from 'react';
import Dither from '../components/Dither';

const TestDither = () => {
  return (
    // 1. Ganti Background jadi Dark Slate (sesuai tema portofolio kamu)
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0f172a' }}>
      
      {/* Container untuk Dither */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.6 }}> 
        {/* Opacity 0.6 biar efeknya tidak terlalu dominan */}
        <Dither
          // 2. Ganti Wave Color jadi Cyan/Teal (R, G, B dalam format 0.0 - 1.0)
          // Warna ini diambil dari aksen tombol "View Projects" kamu
          waveColor={[0.1, 0.7, 0.8]} 
          
          colorNum={4}          // Biarkan 4 biar gradasinya agak halus
          pixelSize={3}         // Naikkan jadi 4 atau 5 biar pixelnya gede & ga bikin pusing
          waveSpeed={0.05}      // Slow motion biar elegan
          waveFrequency={3}     // Kerapatan ombak
          waveAmplitude={0.2}   // Tinggi ombak
          enableMouseInteraction={true}
          mouseRadius={0.4}
        />
      </div>

      {/* 3. RAJA TERAKHIR: Gradient Overlay (Vignette) */}
      {/* Ini trik biar teks di tengah jelas, tapi pinggiran tetep ada efeknya */}
      {/* <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, #0f172a 90%)'
        }} */}
      
      
      {/* Overlay Text */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
        <h1 className="text-white text-6xl font-bold tracking-tight">
          PORTFOLIO
        </h1>
        <p className="text-cyan-400 mt-4 font-mono">
          Creative Developer
        </p>
      </div>

    </div>
  );
};

export default TestDither;