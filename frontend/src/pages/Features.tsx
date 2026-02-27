import { Mic, LineChart, FileText, TrendingUp, Download, Plug } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Mic,
      title: 'Voice & Text Input',
      description: 'Use your natural language to ask questions.',
      color: 'bg-[#14b8a6]',
    },
    {
      icon: LineChart,
      title: 'Auto-Charting Engine',
      description: 'Smart visualisations generated in seconds.',
      color: 'bg-[#14b8a6]',
    },
    {
      icon: FileText,
      title: 'Narrative Summaries',
      description: 'Created with GPT-4 for clarity and depth.',
      color: 'bg-[#14b8a6]',
    },
    {
      icon: TrendingUp,
      title: 'Forecast & Trend Engine',
      description: 'See what\'s coming, not just what happened.',
      color: 'bg-[#14b8a6]',
    },
    {
      icon: Download,
      title: 'Export & Share',
      description: 'Reports ready as PDF/PNG, shareable with teams.',
      color: 'bg-[#14b8a6]',
    },
    {
      icon: Plug,
      title: 'Data Connectors',
      description: 'Upload files or link APIs (Google Sheets, ERP coming soon).',
      color: 'bg-[#14b8a6]',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-mesh transition-colors duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.1] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-5xl font-black text-[var(--text-primary)] mb-6 tracking-tighter">
            Powerful <span className="bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] bg-clip-text text-transparent">Features</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto font-light leading-relaxed">
            Everything you need to turn your data into actionable insights, all powered by cutting-edge AI technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-[var(--border-color)] hover:border-[#14b8a6]/30 transition-all hover:-translate-y-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="relative z-10">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#14b8a6]/20 transition-transform group-hover:scale-110`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-[var(--text-primary)] mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>


        <div className="bg-[var(--bg-secondary)] rounded-[3rem] p-12 shadow-2xl border border-[var(--border-color)] relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit-pattern opacity-[0.02]"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl font-black text-[var(--text-primary)] mb-16 text-center tracking-tighter uppercase font-gravix">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-black shadow-lg shadow-[#14b8a6]/20 group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-0">
                  1
                </div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-3 uppercase tracking-wider">Connect Your Data</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                  Link your databases, spreadsheets, or use our API to import your data securely.
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-black shadow-lg shadow-[#0ea5e9]/20 group-hover:scale-110 transition-transform -rotate-3 group-hover:rotate-0">
                  2
                </div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-3 uppercase tracking-wider">Ask Questions</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                  Simply type your questions in natural language, just like talking to a colleague.
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8b5cf6] to-[#14b8a6] rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-black shadow-lg shadow-[#8b5cf6]/20 group-hover:scale-110 transition-transform rotate-6 group-hover:rotate-0">
                  3
                </div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-3 uppercase tracking-wider">Get Insights</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                  Receive instant answers with visualizations and actionable recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

