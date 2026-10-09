import React from 'react';
import { Sparkles, Shield, Compass, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Manifesto Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
          OUR MANIFESTO
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white font-heading">
          FOR THOSE WHO MOVE DIFFERENT<span className="text-[#dc2626]">.</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          MAXVEY was born on the vibrant, unrelenting streets of Lagos, Nigeria. We craft premium streetwear for individuals who break mold, shape culture, and operate on their own frequencies.
        </p>
      </div>

      {/* Visual Break */}
      <div className="relative rounded-2xl overflow-hidden border border-[#27272a] aspect-[16/9] bg-black">
        <img
          src="/images/hero.jpg"
          alt="MAXVEY Streetwear Studio Lagos"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-end p-8">
          <p className="text-xs font-mono uppercase text-zinc-400">
            LAGOS WORKSHOP · INDEPENDENT NIGERIAN FASHION ARCHITECTURE
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-3">
          <span className="text-xs font-mono font-bold text-[#dc2626]">01 / THE SILHOUETTE</span>
          <h3 className="text-lg font-bold text-white font-heading uppercase">Structure Over Flimsy</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            We reject light, shapeless cottons. Every MAXVEY tee is cut from custom-knitted 260GSM combed cotton, providing structured drop shoulders, sturdy collars, and clean boxy proportions that hold shape post-wash.
          </p>
        </div>

        <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-3">
          <span className="text-xs font-mono font-bold text-[#dc2626]">02 / THE ARTWORK</span>
          <h3 className="text-lg font-bold text-white font-heading uppercase">Hand-Pulled Precision</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Our red dripping graffiti tags, graphic characters, and cyber metal typography use premium plastisol and discharge inks that maintain intense pigment vibrancy and resist cracking through harsh climates.
          </p>
        </div>

        <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-3">
          <span className="text-xs font-mono font-bold text-[#dc2626]">03 / THE ETHOS</span>
          <h3 className="text-lg font-bold text-white font-heading uppercase">Engineered in Lagos</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            From pattern drafting to final hand tagging, MAXVEY embodies West African modern creativity. We are proving that luxury streetwear from Nigeria can compete on the world stage.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 bg-[#121215] border border-[#27272a] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold uppercase text-white font-heading">Ready to upgrade your rotation?</h3>
          <p className="text-xs text-zinc-400 mt-1">Shop Drop 01 with express 24-48h dispatch in Lagos.</p>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center gap-2 shrink-0"
        >
          <span>EXPLORE SHOP</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
