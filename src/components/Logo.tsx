import React from "react";

interface LogoProps {
  isRtl?: boolean;
  onClick?: () => void;
}

export default function Logo({ isRtl, onClick }: LogoProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <div className="relative w-[58px] h-[58px] flex items-center justify-center border border-accent/25 bg-zinc-950/50 overflow-hidden group-hover:border-accent transition-colors duration-300">
  <img
    src="/logo.svg"
    alt="LES ROMAINS"
    className="w-full h-full object-cover select-none"
    draggable={false}
/>
</div>

      <div>
        <div className="text-white font-bold">
          LES ROMAINS
        </div>

        <div className="text-xs text-yellow-500">
          {isRtl ? "مشغل هندسي" : "Creative Atelier"}
        </div>
      </div>
    </div>
  );
}