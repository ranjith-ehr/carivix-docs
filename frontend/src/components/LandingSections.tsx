import { Upload, Mic, Sparkles, Download, CheckCircle2, Zap, BarChart3, ArrowRight } from 'lucide-react';
import AIAnalysisImg from '../assets/ai-analysis.png';

export default function LandingSections() {
    return (
        <div className="bg-[var(--bg-primary)] text-[var(--text-secondary)] pb-20 transition-colors duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
            {/* How It Works Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-center text-[var(--text-primary)] mb-20 tracking-tighter">
                    How It <span className="text-[#14b8a6]">Works</span>
                </h2>
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 relative">
                    {/* Step 1 */}
                    <div className="flex-1 flex flex-col items-center text-center group w-full">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg shadow-[#14b8a6]/20 group-hover:scale-110 transition-transform">
                            1
                        </div>
                        <div className="bg-[var(--bg-secondary)] p-8 rounded-[2rem] border border-[var(--border-color)] w-full min-h-[200px] flex flex-col justify-center hover:border-[#14b8a6]/30 transition-all shadow-xl">
                            <Upload className="w-10 h-10 text-[#14b8a6] mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Upload Data</h3>
                            <p className="text-xs text-[var(--text-secondary)] font-medium">CSV / Excel / Google Sheets / API</p>
                        </div>
                    </div>

                    <div className="hidden md:flex mt-28 text-gray-700">
                        <ArrowRight className="w-6 h-6 opacity-20" />
                    </div>

                    {/* Step 2 */}
                    <div className="flex-1 flex flex-col items-center text-center group w-full">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg shadow-[#14b8a6]/20 group-hover:scale-110 transition-transform">
                            2
                        </div>
                        <div className="bg-[var(--bg-secondary)] p-8 rounded-[2rem] border border-[var(--border-color)] w-full min-h-[200px] flex flex-col justify-center hover:border-[#14b8a6]/30 transition-all shadow-xl">
                            <Mic className="w-10 h-10 text-[#0ea5e9] mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Ask Questions</h3>
                            <p className="text-xs text-[var(--text-secondary)] font-medium">Voice or Natural Language</p>
                        </div>
                    </div>

                    <div className="hidden md:flex mt-28 text-gray-700">
                        <ArrowRight className="w-6 h-6 opacity-20" />
                    </div>

                    {/* Step 3 */}
                    <div className="flex-1 flex flex-col items-center text-center group w-full">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg shadow-[#14b8a6]/20 group-hover:scale-110 transition-transform">
                            3
                        </div>
                        <div className="bg-[var(--bg-secondary)] p-8 rounded-[2rem] border border-[var(--border-color)] w-full min-h-[200px] flex flex-col justify-center hover:border-[#14b8a6]/30 transition-all shadow-xl">
                            <Sparkles className="w-10 h-10 text-[#14b8a6] mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Get Answers</h3>
                            <p className="text-xs text-[var(--text-secondary)] font-medium">Auto-generated charts + GPT summary</p>
                        </div>
                    </div>

                    <div className="hidden md:flex mt-28 text-gray-700">
                        <ArrowRight className="w-6 h-6 opacity-20" />
                    </div>

                    {/* Step 4 */}
                    <div className="flex-1 flex flex-col items-center text-center group w-full">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg shadow-[#14b8a6]/20 group-hover:scale-110 transition-transform">
                            4
                        </div>
                        <div className="bg-[var(--bg-secondary)] p-8 rounded-[2rem] border border-[var(--border-color)] w-full min-h-[200px] flex flex-col justify-center hover:border-[#14b8a6]/30 transition-all shadow-xl">
                            <Download className="w-10 h-10 text-[#0ea5e9] mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Act or Export</h3>
                            <p className="text-xs text-[var(--text-secondary)] font-medium">PDF, PNG, or Live Sharing</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Benefits Section */}
            <section className="py-24 px-6 bg-[var(--bg-secondary)]/50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-center text-[var(--text-primary)] mb-20 tracking-tighter">
                        Key <span className="text-[#0ea5e9]">Benefits</span>
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <BenefitCard
                            icon={Mic}
                            title="Voice Input"
                            description="Speak or type your question; CARIVIX listens and understands context."
                            color="text-[#14b8a6]"
                        />
                        <BenefitCard
                            icon={BarChart3}
                            title="Smart Visuals"
                            description="Beautiful charts generated automatically, tailored to your specific query."
                            color="text-[#0ea5e9]"
                        />
                        <BenefitCard
                            icon={Sparkles}
                            title="GPT-4 Insights"
                            description="A narrative analysis that a human expert might write, ready in seconds."
                            color="text-[#14b8a6]"
                        />
                        <BenefitCard
                            icon={Zap}
                            title="Zero Config"
                            description="No technical setup or coding required. Just plug in your data and ask."
                            color="text-[#0ea5e9]"
                        />
                    </div>
                </div>
            </section>

            {/* Why CARIVIX Section */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <h2 className="text-5xl font-black text-[var(--text-primary)] tracking-tighter">Why CARIVIX</h2>
                        <p className="text-2xl font-light text-[#14b8a6] leading-relaxed">
                            We believe data should be <span className="font-bold text-[var(--text-primary)] italic">accessible to everyone.</span>
                        </p>
                        <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed text-lg font-light">
                            <p>
                                We break down barriers to data access, turning complex columns into simple, visual stories. Traditional BI tools consume time and require technical expertise.
                            </p>
                            <p className="bg-[var(--bg-secondary)] p-6 rounded-2xl border-l-4 border-[#14b8a6]">
                                Built on <span className="text-[var(--text-primary)] font-bold">GPT-4</span> and intelligent visualization engines — CARIVIX empowers decision-making across industries and languages.
                            </p>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl transition-all group-hover:border-[#14b8a6]/40">
                            <img
                                src={AIAnalysisImg}
                                alt="AI Analysis"
                                className="w-full h-[450px] object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-8 -right-8 bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-2xl flex items-center space-x-4 border border-[var(--border-color)] group-hover:scale-105 transition-transform">
                            <div className="bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] p-3 rounded-xl">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-[var(--text-primary)] font-black text-sm tracking-widest uppercase">GPT-4 Powered</p>
                                <p className="text-[#14b8a6]/80 text-xs font-bold">Advanced Intelligence</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who It's For Section */}
            <section className="py-24 px-6 bg-[var(--bg-secondary)]/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-20 tracking-tighter">
                        Who It's <span className="text-[#14b8a6]">For</span>
                    </h2>
                    <div className="grid gap-4">
                        <TargetItem text="Startup founders who want fast business insights" />
                        <TargetItem text="Analysts and researchers needing clarity without coding" />
                        <TargetItem text="Educators and students exploring data storytelling" />
                        <TargetItem text="Policy makers and government teams looking for clear summaries" />
                        <TargetItem text="SMEs and e-commerce teams who want decisions, not dashboards" />
                    </div>
                </div>
            </section>
        </div>
    );
}

function BenefitCard({ icon: Icon, title, description, color, highlight = false }: { icon: any, title: string, description: string, color: string, highlight?: boolean }) {
    return (
        <div className={`p-10 rounded-[2.5rem] transition-all duration-500 border-2 ${highlight
            ? 'bg-[var(--bg-secondary)] border-[#14b8a6] shadow-2xl shadow-[#14b8a6]/20 scale-105'
            : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[#0ea5e9] hover:shadow-2xl hover:shadow-[#0ea5e9]/10 hover:-translate-y-2'
            } group cursor-default shadow-sm`}>
            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 ${color} transition-transform group-hover:scale-110`}>
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">{title}</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed font-light">{description}</p>
        </div>
    );
}

function TargetItem({ text }: { text: string }) {
    return (
        <div className="flex items-center space-x-8 p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-primary)] hover:border-[#14b8a6]/20 transition-all text-left group cursor-default shadow-sm">
            <div className="bg-[#14b8a6]/10 p-3 rounded-xl group-hover:bg-[#14b8a6]/20 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-[#14b8a6]" />
            </div>
            <span className="text-xl font-light text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors tracking-wide">{text}</span>
        </div>
    );
}
