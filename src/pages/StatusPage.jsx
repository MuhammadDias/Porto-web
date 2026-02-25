import React from 'react';
import { Link } from 'react-router-dom';
import DStatusLoader from '../components/DStatusLoader';

export default function StatusPage({ code, title, message, retryLabel, homeLabel }) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="relative overflow-hidden pb-16 pt-12 md:pb-20 md:pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute bottom-[-16rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[#ff7a00]/[0.05] blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl border border-white/15 bg-black/55 p-6 md:p-10">
          <p className="mb-3 text-xs uppercase tracking-[0.38em] text-slate-400">{code}</p>
          <h1 className="mb-3 text-3xl font-semibold text-white md:text-5xl">{title}</h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">{message}</p>

          <DStatusLoader label={title} />

          <div className="mt-2 flex flex-wrap gap-3">
            <button onClick={handleRetry} className="btn-primary">
              {retryLabel}
            </button>
            <Link to="/" className="btn-outline">
              {homeLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
