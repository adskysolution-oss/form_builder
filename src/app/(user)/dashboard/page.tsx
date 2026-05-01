"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Zap, 
  ArrowUpRight, 
  TrendingUp, 
  Activity,
  MousePointer2
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', leads: 40, conv: 24 },
  { name: 'Tue', leads: 30, conv: 13 },
  { name: 'Wed', leads: 20, conv: 98 },
  { name: 'Thu', leads: 27, conv: 39 },
  { name: 'Fri', leads: 18, conv: 48 },
  { name: 'Sat', leads: 23, conv: 38 },
  { name: 'Sun', leads: 34, conv: 43 },
];

export default function UserDashboard() {
  const stats = [
    { title: "Total Forms", value: "12", sub: "+2 this month", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Total Leads", value: "450", sub: "+85 this month", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "Revenue", value: "₹12,450", sub: "+15% growth", icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10" },
    { title: "Conv. Rate", value: "8.4%", sub: "Above avg", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
           <h2 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
             Welcome Back, Abhi <span className="animate-bounce">👋</span>
           </h2>
           <p className="text-slate-400 font-medium tracking-wide">Here is your platform performance for today.</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3 border-blue-500/20">
              <Activity className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">Live Status: Active</span>
           </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl border-white/5 hover:border-blue-500/30 transition-all duration-500 group overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                  Live <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.title}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-white">{stat.value}</span>
                <span className="text-xs font-medium text-green-500">{stat.sub}</span>
              </div>
            </CardContent>
            {/* Background Glow Effect */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full" />
          </Card>
        ))}
      </div>

      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Card */}
        <Card className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl border-white/5 p-8 relative overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-white">Lead Inflow</h3>
                <p className="text-sm text-slate-500">Weekly submission trends</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20">WEEKLY</button>
                 <button className="px-4 py-2 bg-white/5 text-slate-400 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">MONTHLY</button>
              </div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%;" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%;" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B0F1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </Card>

        {/* Activity Feed / Promo Card */}
        <div className="space-y-6">
           <Card className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl border-blue-500/20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="bg-white p-3 rounded-2xl w-fit mb-6">
                   <Zap className="h-6 w-6 text-blue-600 fill-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 leading-tight">Generate Forms with AI</h3>
                <p className="text-slate-300 text-sm mb-6">Type a prompt and let SmartForm AI build your structure in seconds.</p>
                <button className="w-full py-4 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-[0.98]">
                   TRY AI BUILDER <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full group-hover:bg-blue-500/30 transition-colors" />
           </Card>

           <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-6 border-white/5 space-y-4">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Global Insights</h4>
              <div className="flex items-center gap-4 group cursor-pointer">
                 <div className="bg-white/5 p-3 rounded-xl text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all">
                    <MousePointer2 className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white">Heatmaps Beta</p>
                    <p className="text-xs text-slate-500">Analyze user focus points.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
