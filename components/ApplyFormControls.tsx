import React from 'react';
import { Eye, Trash2, Plus, GripVertical, CheckSquare, Type, Upload, List } from 'lucide-react';

export interface FormConfig {
    personalInfo: {
        name: boolean;
        email: boolean;
        phone: boolean;
        linkedin: boolean;
        portfolio: boolean;
        education: boolean;
        resume: boolean;
        coverLetter: boolean;
    };
    questions: {
        id: number;
        type: string;
        label: string;
        required: boolean;
    }[];
}

interface ApplyFormControlsProps {
    config: FormConfig;
    onChange: (newConfig: FormConfig) => void;
}

export const ApplyFormControls: React.FC<ApplyFormControlsProps> = ({ config, onChange }) => {

    const updatePersonalInfo = (field: keyof FormConfig['personalInfo']) => {
        onChange({
            ...config,
            personalInfo: {
                ...config.personalInfo,
                [field]: !config.personalInfo[field]
            }
        });
    };

    const addQuestion = (type: string) => {
        onChange({
            ...config,
            questions: [
                ...config.questions,
                { id: Date.now(), type, label: "", required: false }
            ]
        });
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQuestions = [...config.questions];
        (newQuestions[index] as any)[field] = value;
        onChange({ ...config, questions: newQuestions });
    };

    const removeQuestion = (id: number) => {
        onChange({
            ...config,
            questions: config.questions.filter(q => q.id !== id)
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Form Configuration</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

                {/* SECTION 1: PERSONAL INFO */}
                <div className="mb-6">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Info</h3>
                    <div className="space-y-2">
                        {Object.keys(config.personalInfo).map((field) => (
                            <div key={field} className="flex items-center justify-between p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                    {field.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <button
                                    onClick={() => updatePersonalInfo(field as keyof FormConfig['personalInfo'])}
                                    className={`w-9 h-5 rounded-full relative transition-colors duration-200 ease-in-out ${config.personalInfo[field as keyof FormConfig['personalInfo']] ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200 ${config.personalInfo[field as keyof FormConfig['personalInfo']] ? 'left-5' : 'left-1'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 2: QUESTIONS */}
                <div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Custom Questions</h3>
                    <div className="space-y-3 mb-4">
                        {config.questions.map((q, i) => (
                            <div key={q.id} className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="p-1 bg-gray-100 dark:bg-white/10 rounded text-gray-500">
                                            {q.type === 'file' ? <Upload className="w-3 h-3" /> :
                                                q.type === 'yes_no' ? <CheckSquare className="w-3 h-3" /> :
                                                    <Type className="w-3 h-3" />}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase text-gray-400">{q.type.replace('_', ' ')}</span>
                                    </div>
                                    <button onClick={() => removeQuestion(q.id)} className="text-gray-400 hover:text-red-500">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <input
                                    value={q.label}
                                    onChange={(e) => updateQuestion(i, 'label', e.target.value)}
                                    className="w-full text-sm bg-transparent border-b border-gray-200 dark:border-white/10 focus:border-green-500 outline-none py-1 mb-2 dark:text-white"
                                    placeholder="Question text..."
                                />

                                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={q.required}
                                        onChange={(e) => updateQuestion(i, 'required', e.target.checked)}
                                        className="rounded text-green-600 focus:ring-green-500"
                                    />
                                    Required
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { label: 'Text', type: 'text', icon: Type },
                            { label: 'Yes/No', type: 'yes_no', icon: CheckSquare },
                            { label: 'File', type: 'file', icon: Upload },
                            { label: 'Choice', type: 'multiple_choice', icon: List }
                        ].map(btn => (
                            <button
                                key={btn.label}
                                onClick={() => addQuestion(btn.type)}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-green-500 hover:text-green-600 transition-all"
                            >
                                <btn.icon className="w-3 h-3" /> {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
