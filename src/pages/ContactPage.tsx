import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Send, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header */}
      <div className="border-b border-[#27272a] pb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-[#dc2626] uppercase">
          CUSTOMER CONCIERGE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading mt-1">
          CONTACT MAXVEY
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
          Need sizing advice, order updates, or wholesale inquiries? Our Lagos team is on standby to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Contact Channels */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* WhatsApp Direct */}
          <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#25D366]/10 text-[#25D366] rounded-lg">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-heading">
                  WhatsApp Support (Fastest)
                </h3>
                <p className="text-xs text-zinc-400">Average response: Under 15 mins</p>
              </div>
            </div>
            <p className="text-xs text-zinc-300 font-mono">
              +234 902 960 2573
            </p>
            <a
              href="https://wa.me/2349029602573?text=Hello%20MAXVEY%2C%20I%20have%20an%20inquiry%20regarding%20your%20streetwear."
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open WhatsApp Chat</span>
            </a>
          </div>

          {/* Email Direct */}
          <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-zinc-800 text-white rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-heading">
                  Official Email
                </h3>
                <p className="text-xs text-zinc-400">Order verification & partnerships</p>
              </div>
            </div>
            <a
              href="mailto:maxwellunusual@gmail.com"
              className="text-xs text-zinc-200 hover:text-white underline font-mono block"
            >
              maxwellunusual@gmail.com
            </a>
          </div>

          {/* Location */}
          <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-zinc-800 text-white rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-heading">
                  Lagos Cutting Room & Studio
                </h3>
                <p className="text-xs text-zinc-400">Lekki Phase 1, Lagos, Nigeria</p>
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              Operating Hours: Monday – Saturday: 9:00 AM – 7:00 PM WAT
            </p>
          </div>

        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-[#121215] border border-[#27272a] rounded-xl p-8 space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
            SEND US A DIRECT MESSAGE
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-950/60 border border-emerald-800 rounded-lg text-center space-y-3">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white uppercase">Message Sent Successfully</h4>
              <p className="text-xs text-zinc-300">
                Thank you, {name}. Our customer support team will reply to {email} within 2–4 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maxwell"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-[#dc2626]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-[#dc2626]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sizing inquiry / Order #MV-2409"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Message *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us what you need help with..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND MESSAGE</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
