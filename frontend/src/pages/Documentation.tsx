import { ChevronRight, Database, Mic, Sparkles, Download, Shield, Layout } from 'lucide-react';

interface DocumentationProps {
    onBack?: () => void;
}

export default function Documentation({ onBack }: DocumentationProps) {
    const sections = [
        {
            title: "Getting Started",
            icon: Layout,
            color: "text-blue-500",
            content: [
                "Create an account or sign in to access the CARIVIX AI dashboard.",
                "Share your location for secure authentication (mandatory for all sessions).",
                "Explore the 'GENERATE NOW' feature on the landing page to start your journey."
            ]
        },
        {
            title: "Data Management",
            icon: Database,
            color: "text-[#14b8a6]",
            content: [
                "Navigate to the chat interface to upload your data files.",
                "Supported formats include CSV, Excel, and direct text input.",
                "Our AI automatically indexes your data for instant querying."
            ]
        },
        {
            title: "Voice & AI Interaction",
            icon: Mic,
            color: "text-purple-500",
            content: [
                "Use the microphone icon to ask questions about your data in natural language.",
                "CARIVIX uses GPT-4 to understand complex business logic and context.",
                "Ask for specific trends, comparisons, or summaries (e.g., 'Compare sales of Q1 vs Q2')."
            ]
        },
        {
            title: "Visual Insights",
            icon: Sparkles,
            color: "text-[#0ea5e9]",
            content: [
                "AI automatically generates the most relevant chart type (Bar, Line, etc.) for your data.",
                "View detailed GPT-powered narrative summaries below every chart.",
                "Hover over chart elements to see precise data points."
            ]
        },
        {
            title: "Exports & Sharing",
            icon: Download,
            color: "text-orange-500",
            content: [
                "Download your analysis results in various formats (PDF/PNG coming soon).",
                "Share live insights with team members through secure links.",
                "Maintain a searchable history of all past analyses in your sidebar."
            ]
        },
        {
            title: "Security & Profile",
            icon: Shield,
            color: "text-red-500",
            content: [
                "Manage your personal info and company details in the Settings page.",
                "Monitor your account security through the 'Login Activity' timeline.",
                "Enable Two-Factor Authentication for an extra layer of protection."
            ]
        }
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-mesh transition-colors duration-300 relative overflow-hidden py-12 px-4">
            <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-[var(--text-primary)] mb-2 tracking-tighter uppercase font-gravix">Documentation</h1>
                        <p className="text-[var(--text-secondary)] font-medium">Master the power of AI-driven data intelligence</p>
                    </div>
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="px-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[var(--text-primary)] font-bold text-sm hover:bg-[var(--bg-primary)] transition-all flex items-center space-x-2"
                        >
                            <span>Back to Home</span>
                        </button>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => {
                        const Icon = section.icon;
                        return (
                            <div key={idx} className="bg-[var(--bg-secondary)] p-8 rounded-[2.5rem] border border-[var(--border-color)] shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
                                <div className="flex items-start space-x-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center border border-[var(--border-color)] ${section.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-black text-[var(--text-primary)] mb-4 uppercase tracking-tight">{section.title}</h2>
                                        <ul className="space-y-3">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="flex items-start space-x-3 text-[var(--text-secondary)] text-sm leading-relaxed">
                                                    <ChevronRight className="w-4 h-4 mt-0.5 text-[#14b8a6] flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Need more help?</h2>
                        <p className="text-white/80 font-medium mb-8 max-w-xl mx-auto text-lg">
                            Our community and support team are available 24/7 to help you unlock the full potential of your data.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="https://www.linkedin.com/in/carivix-ai-70a90b372/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-white text-[#14b8a6] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl inline-block"
                            >
                                Contact Support
                            </a>
                            <a
                                href="https://discord.com/invite/nsT9tT5k"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-black/20 text-white border border-white/20 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black/30 transition-all inline-block"
                            >
                                Join Community
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
