import React, { useRef, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LineChart, Line, AreaChart, Area,
    PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    ScatterChart, Scatter, FunnelChart, Funnel, Treemap,
    ZAxis, ComposedChart
} from 'recharts';
import { Download, Volume2, VolumeX, Sparkles, TrendingUp, Info } from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

interface AIVisualizationProps {
    data: any[];
    type: string;
    title: string;
    explanation: string;
    onTitleChange?: (newTitle: string) => void;
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

const AIVisualization: React.FC<AIVisualizationProps> = ({ data, type, title, explanation, onTitleChange }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [currentTitle, setCurrentTitle] = useState(title);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    const handleTitleSave = () => {
        setIsEditingTitle(false);
        if (currentTitle !== title && onTitleChange) {
            onTitleChange(currentTitle);
        }
    };

    const downloadImage = async () => {
        if (chartRef.current === null) return;
        try {
            const dataUrl = await toPng(chartRef.current, { cacheBust: true, backgroundColor: '#0f172a' });
            const link = document.createElement('a');
            link.download = `carivix-intelligence-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: COLORS });
        } catch (err) { console.error('Download failed:', err); }
    };

    const toggleSpeech = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(explanation);
            utterance.onend = () => setIsPlaying(false);
            speechRef.current = utterance;
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
        }
    };

    const renderChart = () => {
        const commonProps = { data, margin: { top: 10, right: 30, left: 10, bottom: 10 } };
        const chartType = type.toLowerCase();

        switch (chartType) {
            case 'pie':
            case 'pie_chart':
                return (
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                            {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Legend />
                    </PieChart>
                );
            case 'radar':
            case 'radar_chart':
                return (
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="name" stroke="#94a3b8" />
                        <PolarRadiusAxis stroke="#334155" />
                        <Radar name="Performance" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                    </RadarChart>
                );
            case 'scatter':
                return (
                    <ScatterChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="x" stroke="#94a3b8" />
                        <YAxis dataKey="y" stroke="#94a3b8" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Scatter name="Data Points" data={data} fill="#6366f1" />
                    </ScatterChart>
                );
            case 'bubble_chart':
                return (
                    <ScatterChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="x" stroke="#94a3b8" />
                        <YAxis dataKey="y" stroke="#94a3b8" />
                        <ZAxis dataKey="size" range={[50, 400]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Scatter name="Data Bubbles" data={data} fill="#ec4899" fillOpacity={0.7} />
                    </ScatterChart>
                );
            case 'funnel':
                return (
                    <FunnelChart {...commonProps}>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Funnel dataKey="value" data={data} isAnimationActive>
                            {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Funnel>
                    </FunnelChart>
                );
            case 'treemap':
            case 'heatmap':
                return (
                    <ResponsiveContainer width="100%" height={250}>
                        <Treemap data={data} dataKey="size" stroke="#fff" fill="#6366f1" />
                    </ResponsiveContainer>
                );
            case 'area':
            case 'area_chart':
            case 'seasonal':
                return (
                    <AreaChart {...commonProps}>
                        <defs>
                            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorArea2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorArea)" />
                        {data[0]?.sales !== undefined && <Area type="monotone" dataKey="sales" stroke="#ec4899" fillOpacity={1} fill="url(#colorArea2)" />}
                    </AreaChart>
                );
            case 'line':
            case 'line_chart':
            case 'multi_line':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="profits" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                );
            case 'smooth_line':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Line type="basis" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={false} />
                    </LineChart>
                );
            case 'step_chart':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Line type="stepAfter" dataKey="value" stroke="#8b5cf6" strokeWidth={3} />
                    </LineChart>
                );
            case 'sparkline':
                return (
                    <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false} />
                    </LineChart>
                );
            case 'kpi_gauge':
                return (
                    <PieChart>
                        <Pie data={[{ name: 'Score', value: data[0]?.value || 75 }, { name: 'Remaining', value: 100 - (data[0]?.value || 75) }]}
                            dataKey="value" cx="50%" cy="80%" startAngle={180} endAngle={0} innerRadius={80} outerRadius={120} fill="#334155">
                            <Cell fill="#10b981" />
                            <Cell fill="#334155" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                    </PieChart>
                );
            case 'bullet_chart':
                return (
                    <BarChart layout="vertical" data={data} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#94a3b8" />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Bar dataKey="value" fill="#6366f1" barSize={10} radius={4} />
                    </BarChart>
                );
            case 'stacked_bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Legend />
                        <Bar dataKey="sales" stackId="a" fill="#6366f1" />
                        <Bar dataKey="profits" stackId="a" fill="#ec4899" />
                    </BarChart>
                );
            case 'candlestick':
                return (
                    <ComposedChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Bar dataKey="value" fill="#10b981" barSize={20} />
                        <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    </ComposedChart>
                );
            case 'dashboard':
            case 'mini_charts':
            case 'scorecard':
                return (
                    <div className="flex flex-wrap gap-4 justify-center items-center h-full p-4 overflow-y-auto w-full">
                        {data.map((item, i) => (
                            <div key={i} className="bg-slate-800 p-6 rounded-2xl w-40 text-center border border-slate-700 shadow-md flex-shrink-0 relative group hover:border-indigo-500/50 transition-colors">
                                <p className="text-slate-400 text-xs uppercase mb-2 font-bold group-hover:text-indigo-300">{item.name}</p>
                                <p className="text-white text-2xl font-black">{Math.round(item.value).toLocaleString()}</p>
                                {item.sales !== undefined && <p className="text-emerald-400 text-xs mt-2 font-medium">↑ {Math.round(item.sales).toLocaleString()}</p>}
                            </div>
                        ))}
                    </div>
                );
            case 'bar':
            case 'bar_chart':
            case 'grouped_bar':
            default:
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                        <Legend />
                        <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        {data[0]?.sales !== undefined && <Bar dataKey="sales" fill="#ec4899" radius={[6, 6, 0, 0]} />}
                    </BarChart>
                );
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div
                ref={chartRef}
                className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl p-6 relative group"
            >
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            {isEditingTitle ? (
                                <input
                                    type="text"
                                    value={currentTitle}
                                    onChange={(e) => setCurrentTitle(e.target.value)}
                                    onBlur={handleTitleSave}
                                    onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                                    autoFocus
                                    className="bg-slate-800 border border-indigo-500/50 rounded px-2 py-1 text-white text-lg font-bold w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                />
                            ) : (
                                <h3
                                    onClick={() => setIsEditingTitle(true)}
                                    className="text-lg font-bold text-white tracking-tight cursor-pointer hover:text-indigo-300 transition-colors"
                                >
                                    {currentTitle}
                                </h3>
                            )}
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">AI-Generated Intelligence</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={toggleSpeech}
                            className={`p-2.5 rounded-xl transition-all ${isPlaying ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'} border hover:scale-105 active:scale-95`}
                            title={isPlaying ? "Stop Listening" : "Listen to Analysis"}
                        >
                            {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={downloadImage}
                            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl border border-indigo-400/30 transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                            title="Download Visualization"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Chart View */}
                {type.toLowerCase() === 'dashboard' || type.toLowerCase() === 'mini_charts' || type.toLowerCase() === 'scorecard' ? (
                    <div className="w-full mb-8 relative">
                        {renderChart()}
                    </div>
                ) : (
                    <div className="h-[350px] w-full mb-8 relative">
                        <div className="absolute inset-x-0 -top-4 bottom-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
                        <ResponsiveContainer width="100%" height="100%">
                            {renderChart()}
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Narrative Section */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 relative">
                    <div className="absolute top-4 left-5 flex items-center gap-2 text-indigo-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Executive Insight</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mt-6 italic font-light">
                        "{explanation}"
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-slate-500 text-[10px]">
                        <Info className="w-3 h-3" />
                        <span>Data verified against latest fiscal recording</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIVisualization;
