import React, { useState } from 'react';
import { X, Lock, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface SocialLoginMockProps {
    provider: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (email: string) => void;
}

export const SocialLoginMock: React.FC<SocialLoginMockProps> = ({ provider, isOpen, onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [step, setStep] = useState<'input' | 'handshake'>('input');

    if (!isOpen) return null;

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSimulating(true);
        setStep('handshake');

        // Simulate Network Delay (Law 1: "Complex State")
        setTimeout(() => {
            setIsSimulating(false);
            onSuccess(email); // Pass email back to parent
            onClose();
            setStep('input');
            setEmail('');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-edluar-deep/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-edluar-surface w-full max-w-md rounded-2xl shadow-2xl border border-edluar-pale dark:border-edluar-moss/30 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-edluar-pale/30 dark:border-edluar-moss/20 bg-gray-50 dark:bg-black/20">
                    <div className="flex items-center space-x-2 text-sm font-bold text-edluar-dark dark:text-edluar-cream">
                        <Lock className="w-4 h-4 text-green-500" />
                        <span>{provider} Secure Login (Simulation)</span>
                    </div>
                    <button onClick={onClose} className="text-edluar-dark/50 hover:text-red-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    {step === 'input' ? (
                        <form onSubmit={handleSimulate} className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-edluar-pale/30 rounded-full flex items-center justify-center text-2xl font-serif font-bold text-edluar-moss mb-4">
                                    {provider[0]}
                                </div>
                                <h3 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream">Continue with {provider}</h3>
                                <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60 mt-2">
                                    Enter the email associated with your account to simulate the OAuth handshake.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-edluar-dark/50">Simulated Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-edluar-pale dark:border-edluar-moss/30 bg-edluar-cream/20 dark:bg-black/20 outline-none focus:ring-2 focus:ring-edluar-moss/50 transition-all"
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg flex items-start space-x-3 border border-yellow-200 dark:border-yellow-900/30">
                                <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-700 dark:text-yellow-500 leading-relaxed">
                                    <strong>Dev Note:</strong> This is a mock environment. No actual data is sent to {provider}. Logic enforces email existence in DB.
                                </p>
                            </div>

                            <Button type="submit" className="w-full justify-center">Simulate Handshake</Button>
                        </form>
                    ) : (
                        <div className="py-12 flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 border-4 border-edluar-pale border-t-edluar-moss rounded-full animate-spin"></div>
                            <p className="font-medium text-edluar-dark dark:text-edluar-cream">Verifying credentials...</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
