import { useState, useEffect } from 'react';
import { History, MapPin, Clock, Calendar, ArrowLeft, ArrowRight, Activity, Filter, Shield } from 'lucide-react';
import { userService, LoginRecord } from '../services/userService';
import { authService } from '../services/authService';

interface LoginHistoryProps {
    onBack?: () => void;
}

export default function LoginHistory({ onBack }: LoginHistoryProps) {
    const [history, setHistory] = useState<LoginRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        uniqueLocations: 0,
        lastActive: ''
    });

    useEffect(() => {
        const loadHistory = async () => {
            const user = await authService.getCurrentUser();
            if (user) {
                const data = await userService.getLoginHistory(user.id);
                setHistory(data);

                // Calculate basic stats
                const locations = new Set(data.map(r => `${r.lat.toFixed(2)},${r.lng.toFixed(2)}`));
                setStats({
                    total: data.length,
                    uniqueLocations: locations.size,
                    lastActive: data.length > 0 ? new Date(data[0].login_at).toLocaleString() : 'Never'
                });
            }
            setIsLoading(false);
        };
        loadHistory();
    }, []);

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            date: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
            time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-mesh p-4 md:p-8 transition-colors duration-300 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] pointer-events-none"></div>
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] pointer-events-none"></div>
            <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-[#14b8a6]/5 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onBack}
                            className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[var(--text-secondary)] hover:text-[#14b8a6] hover:border-[#14b8a6]/30 transition-all shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Login History</h1>
                            <p className="text-[var(--text-secondary)] font-medium">Security & activity tracking</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] text-sm font-bold hover:border-[#14b8a6]/20 transition-all">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white rounded-xl text-sm font-black shadow-lg shadow-[#14b8a6]/20 hover:scale-[1.02] transition-all">
                            <Calendar className="w-4 h-4" />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Total Sign-ins', value: stats.total, icon: Activity, color: 'text-[#14b8a6]', bg: 'bg-[#14b8a6]/10' },
                        { label: 'Unique Locations', value: stats.uniqueLocations, icon: MapPin, color: 'text-[#0ea5e9]', bg: 'bg-[#0ea5e9]/10' },
                        { label: 'Last Activity', value: stats.lastActive, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' }
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="bg-[var(--bg-secondary)] p-6 rounded-[2rem] border border-[var(--border-color)] shadow-xl relative overflow-hidden group">
                                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-[var(--text-primary)] mt-1">{stat.value}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Timeline / List */}
                <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#14b8a6] via-[#0ea5e9] to-purple-500"></div>

                    <div className="p-8 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/30">
                        <h2 className="text-xl font-black text-[var(--text-primary)]">Activity Timeline</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] border-b border-[var(--border-color)]">
                                    <th className="px-8 py-5">Date & Time</th>
                                    <th className="px-8 py-5">Location Coordinates</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 border-4 border-[#14b8a6]/20 border-t-[#14b8a6] rounded-full animate-spin"></div>
                                                <p className="mt-4 text-[var(--text-secondary)] font-bold">Loading records...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : history.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <History className="w-10 h-10 text-[var(--text-secondary)] opacity-20 mx-auto mb-4" />
                                            <p className="text-[var(--text-secondary)] font-bold">No login records found yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((record) => {
                                        const { date, time } = formatDateTime(record.login_at);
                                        return (
                                            <tr key={record.id} className="group hover:bg-[var(--bg-primary)]/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] group-hover:border-[#14b8a6]/20 transition-all">
                                                            <Calendar className="w-5 h-5 text-[#14b8a6]" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-[var(--text-primary)]">{date}</p>
                                                            <p className="text-xs text-[var(--text-secondary)] font-medium font-mono">{time}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-2 text-[var(--text-primary)] font-mono text-sm bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)] w-fit">
                                                        <MapPin className="w-3 h-3 text-[var(--text-secondary)]" />
                                                        <span>{record.lat.toFixed(4)}, {record.lng.toFixed(4)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="inline-flex items-center px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-full border border-green-500/20 tracking-widest">
                                                        Successful
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="p-2 text-[var(--text-secondary)] hover:text-[#0ea5e9] transition-colors">
                                                        <ArrowRight className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-[#14b8a6]/10 to-[#0ea5e9]/10 rounded-3xl border border-[#14b8a6]/10 text-center">
                    <p className="text-[var(--text-secondary)] text-sm font-medium">
                        <Shield className="w-4 h-4 inline-block mr-2 text-[#14b8a6]" />
                        This data is automatically collected for your account security. If you see unrecognized activity, please change your password immediately.
                    </p>
                </div>
            </div>
        </div>
    );
}
