import React from "react";

const Header = ({ title }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
              Emission intelligence
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">{title}</h1>
          </div>

          <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 sm:block">
            Production dashboard
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
