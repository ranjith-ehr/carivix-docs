import { Target, Users, Shield, Zap, Heart, MessageSquare } from 'lucide-react';

export default function About() {
  const values = [
    { name: 'Innovation', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { name: 'Accessibility', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
    { name: 'Growth', icon: Target, iconName: 'Target', color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Collaboration', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Integrity', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-mesh transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background Patterns */}
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.1] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#14b8a6]/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0ea5e9]/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#14b8a6]/10 text-[#14b8a6] text-xs font-bold uppercase tracking-widest mb-6 border border-[#14b8a6]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14b8a6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14b8a6]"></span>
              </span>
              <span>Our Story</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-[var(--text-primary)] mb-8 tracking-tighter leading-none">
              Insight is <br />
              <span className="bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] bg-clip-text text-transparent">Spoken, not coded.</span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] leading-relaxed font-light mb-8 italic border-l-4 border-[#14b8a6] pl-6">
              "We believe data should be accessible to everyone, turning complex columns into simple, visual stories."
            </p>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] p-8 md:p-12 border border-[var(--border-color)] shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="relative z-10 space-y-6">
                <p className="text-lg leading-relaxed text-[var(--text-secondary)] font-medium">
                  Founded by <span className="font-black text-[var(--text-primary)]">Charitha Sree</span>, a solo-founder passionate about simplifying analytics, CARIVIX emerged from the realization that many professionals had great questions but no easy way to answer them.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] flex items-center justify-center text-white shadow-lg shadow-[#14b8a6]/20">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Conversational Data</p>
                    <p className="text-xs text-[var(--text-secondary)]">Interface to your data</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-32 h-32 text-[#14b8a6]" />
              </div>
            </div>
          </div>
        </div>

        {/* Values Cards */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-[0.3em]">Core Values</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.name}
                  className="group bg-[var(--bg-secondary)] p-8 rounded-[2rem] border border-[var(--border-color)] hover:border-[#14b8a6]/30 transition-all duration-500 shadow-xl hover:-translate-y-2 text-center relative overflow-hidden"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-grid-pattern opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className={`w-14 h-14 ${value.bg} ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 duration-500`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider block">
                    {value.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
