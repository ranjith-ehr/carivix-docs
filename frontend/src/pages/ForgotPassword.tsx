import { useState } from 'react';
import { Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

interface ForgotPasswordProps {
    onNavigate: (page: string) => void;
}

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
        }, 1500);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-teal-600 to-green-600"></div>

                <div className="mb-6">
                    <button
                        onClick={() => onNavigate('login')}
                        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Login
                    </button>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold font-gravix bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
                        Reset Password
                    </h2>
                    <p className="text-gray-500 text-sm">Enter your email to receive reset instructions</p>
                </div>

                {isSent ? (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Check your email</h3>
                        <p className="text-gray-600 text-sm">
                            We've sent password reset instructions to <strong>{email}</strong>
                        </p>
                        <button
                            onClick={() => onNavigate('login')}
                            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all mt-6"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="you@company.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="font-semibold">Send Instructions</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
