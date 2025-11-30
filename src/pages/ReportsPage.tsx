import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from 'recharts';
import { Calendar, Filter, Download, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

export const ReportsPage: React.FC = () => {
    const [dateRange, setDateRange] = useState('30d'); // 30d, 90d, ytd
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, [dateRange]);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            let startDate = new Date();
            const endDate = new Date().toISOString();

            if (dateRange === '30d') startDate.setDate(startDate.getDate() - 30);
            if (dateRange === '90d') startDate.setDate(startDate.getDate() - 90);
            if (dateRange === 'ytd') startDate = new Date(new Date().getFullYear(), 0, 1);

            const res = await fetch(`http://localhost:5000/api/reports/overview?startDate=${startDate.toISOString()}&endDate=${endDate}`);
            const data = await res.json();

            const dashboardRes = await fetch('http://localhost:5000/api/reports/dashboard');
            const dashboardData = await dashboardRes.json();

            setMetrics({ ...data, ...dashboardData });
        } catch (err) {
            console.error("Failed to fetch reports:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div></div>;
    if (!metrics) return <div className="p-10 text-center">Failed to load data</div>;

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights & Reports</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track your hiring performance and pipeline health.</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    {['30d', '90d', 'ytd'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${dateRange === range ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            {range === '30d' ? 'Last 30 Days' : range === '90d' ? 'Last Quarter' : 'Year to Date'}
                        </button>
                    ))}
                </div>
            </div>

            {/* NORTH STAR METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Time to Hire</h3>
                        <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.timeToHire}</span>
                        <span className="text-sm text-gray-500">days (avg)</span>
                    </div>
                    <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> <span>Target: 21 days</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Offer Acceptance</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.offerAcceptanceRate}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: `${metrics.offerAcceptanceRate}%` }}></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Active Pipeline</h3>
                        <Users className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.activePipeline}</span>
                        <span className="text-sm text-gray-500">candidates</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Excluding rejected & withdrawn</p>
                </div>

                {/* NEW METRICS */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Time to First Reply</h3>
                        <Clock className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.timeToResponse || 0}</span>
                        <span className="text-sm text-gray-500">hours</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Avg time to engage candidate</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Interviews (30d)</h3>
                        <Users className="w-5 h-5 text-pink-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.interviews || 0}</span>
                        <span className="text-sm text-gray-500">scheduled</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Volume of interviews</p>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* FUNNEL CHART */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Nurture Yield (Funnel)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <FunnelChart>
                            <Tooltip />
                            <Funnel
                                dataKey="count"
                                data={metrics.funnel}
                                isAnimationActive
                            >
                                <LabelList position="right" fill="#000" stroke="none" dataKey="status" />
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                </div>

                {/* SOURCE EFFECTIVENESS */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Source Effectiveness</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={metrics.sources}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="source" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* DEPARTMENT BREAKDOWN */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[400px] lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Hires by Department</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="w-full md:w-1/2 h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={metrics.departments}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="count"
                                        nameKey="department"
                                    >
                                        {metrics.departments.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 space-y-4">
                            {metrics.departments.map((dept: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="font-medium text-gray-700 dark:text-gray-200">{dept.department}</span>
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white">{dept.count} Hires</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                {/* DISQUALIFICATION REASONS */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[400px] lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Disqualification Reasons</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics.disqualification || []}
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="reason"
                                >
                                    {(metrics.disqualification || []).map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>

    );
};
