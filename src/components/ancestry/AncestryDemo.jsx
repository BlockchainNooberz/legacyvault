import { useState } from 'react';
import { X, TrendingUp, TrendingDown, Minus, ChevronRight, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

// Mock Wellington family behavioral data
const behavioralProfile = [
  { trait: 'Risk Tolerance', you: 72, charles: 85, victoria: 45, edward: 68 },
  { trait: 'Concentration', you: 58, charles: 90, victoria: 30, edward: 55 },
  { trait: 'Contrarian', you: 65, charles: 88, victoria: 20, edward: 72 },
  { trait: 'Patience', you: 80, charles: 95, victoria: 70, edward: 50 },
  { trait: 'Liquidity Pref.', you: 40, charles: 20, victoria: 80, edward: 45 },
  { trait: 'Global Scope', you: 75, charles: 60, victoria: 50, edward: 90 },
];

const decisionComparison = [
  {
    year: '2008',
    event: 'Global Financial Crisis',
    you: { action: 'Reduced equities 25%, moved to cash', score: 62, alpha_10yr: '+8.4%' },
    charles: { action: 'Concentrated in distressed real assets', score: 91, alpha_10yr: '+31.2%' },
    victoria: { action: 'Full defensive — 80% bonds/cash', score: 44, alpha_10yr: '+4.1%' },
    edward: { action: 'Held equities, added EM exposure', score: 78, alpha_10yr: '+19.7%' },
  },
  {
    year: '2020',
    event: 'COVID-19 Market Shock',
    you: { action: 'Bought tech + crypto aggressively', score: 88, alpha_10yr: '+41.0%' },
    charles: { action: 'N/A — passed in 2015', score: null, alpha_10yr: '—' },
    victoria: { action: 'Held dividend portfolio, no changes', score: 55, alpha_10yr: '+12.3%' },
    edward: { action: 'Shifted 30% into private credit', score: 71, alpha_10yr: '+24.8%' },
  },
  {
    year: '2022',
    event: 'Rate Hike Cycle & Inflation Spike',
    you: { action: 'Late pivot to real assets — Q3 response', score: 58, alpha_10yr: 'Pending' },
    charles: { action: 'N/A', score: null, alpha_10yr: '—' },
    victoria: { action: 'Moved to TIPS + inflation-linked bonds early', score: 84, alpha_10yr: '+18.6%' },
    edward: { action: 'Increased commodity exposure Feb 2022', score: 90, alpha_10yr: '+27.3%' },
  },
];

const portfolioTrajectory = [
  { year: '2000', you: 100, charles: 100, victoria: 100, edward: 100 },
  { year: '2004', you: 118, charles: 142, victoria: 109, edward: 125 },
  { year: '2008', you: 98, charles: 161, victoria: 104, edward: 138 },
  { year: '2012', you: 134, charles: 210, victoria: 121, edward: 175 },
  { year: '2016', you: 189, charles: 310, victoria: 145, edward: 228 },
  { year: '2020', you: 310, charles: null, victoria: 180, edward: 295 },
  { year: '2024', you: 387, charles: null, victoria: 214, edward: 401 },
];

const members = [
  { key: 'you', name: 'You (Current)', color: '#a78bfa', birth: 1999, role: 'Beneficiary' },
  { key: 'charles', name: 'Charles H. III', color: '#f59e0b', birth: 1941, role: 'Patriarch', deceased: true },
  { key: 'victoria', name: 'Victoria W.', color: '#34d399', birth: 1968, role: 'Matriarch' },
  { key: 'edward', name: 'Edward W. Jr.', color: '#60a5fa', birth: 1965, role: 'Trustee' },
];

const scoreColor = (s) => {
  if (!s) return 'text-white/20';
  if (s >= 80) return 'text-emerald-400';
  if (s >= 60) return 'text-amber-400';
  return 'text-red-400';
};

export default function AncestryDemo({ onClose }) {
  const [activeTab, setActiveTab] = useState('decisions');
  const [selectedMember, setSelectedMember] = useState('charles');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#090e1d] border border-violet-500/20 rounded-2xl overflow-hidden my-4">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Ancestry Decision Engine · Demo</div>
              <div className="text-xs text-white/30">Wellington Family Archive · 4 members · 1941–2026</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">Demo Data</Badge>
            <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Member selector */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 overflow-x-auto">
          {members.map(m => (
            <button
              key={m.key}
              onClick={() => m.key !== 'you' && setSelectedMember(m.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap
                ${m.key === 'you' ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300 cursor-default' :
                  selectedMember === m.key ? 'bg-white/10 border border-white/20 text-white' :
                  'bg-white/[0.03] border border-white/5 text-white/40 hover:text-white/70'}`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.color }} />
              {m.name}
              {m.deceased && <span className="text-white/20 text-[10px]">†</span>}
              <span className="text-white/20 font-normal">{m.role}</span>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4">
          {[
            { key: 'decisions', label: 'Decision Forks' },
            { key: 'behavioral', label: 'Behavioral DNA' },
            { key: 'trajectory', label: 'Portfolio Trajectory' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === t.key ? 'bg-violet-500/20 text-violet-300' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">

          {activeTab === 'decisions' && (
            <div className="space-y-4">
              <p className="text-xs text-white/30 mb-4">
                Comparing your decisions against {members.find(m => m.key === selectedMember)?.name} at each major stress event. Score = decision quality vs. outcome realized.
              </p>
              {decisionComparison.map((d, i) => {
                const them = d[selectedMember];
                return (
                  <div key={i} className="rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
                      <span className="text-xs font-bold text-white/40">{d.year}</span>
                      <span className="text-sm font-semibold text-white">{d.event}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-px bg-white/5">
                      <div className="p-4 bg-[#090e1d]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-violet-400" />
                          <span className="text-xs font-medium text-violet-300">You</span>
                          <span className={`ml-auto text-lg font-bold ${scoreColor(d.you.score)}`}>{d.you.score}</span>
                        </div>
                        <p className="text-xs text-white/50 mb-2">{d.you.action}</p>
                        <div className="flex items-center gap-1 text-xs text-white/30">
                          <TrendingUp className="w-3 h-3" /> 10yr alpha: <span className="text-white/60 font-medium ml-1">{d.you.alpha_10yr}</span>
                        </div>
                      </div>
                      <div className="p-4 bg-[#090e1d]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: members.find(m => m.key === selectedMember)?.color }} />
                          <span className="text-xs font-medium text-white/60">{members.find(m => m.key === selectedMember)?.name}</span>
                          <span className={`ml-auto text-lg font-bold ${scoreColor(them?.score)}`}>{them?.score ?? '—'}</span>
                        </div>
                        <p className="text-xs text-white/50 mb-2">{them?.action ?? 'No data for this period'}</p>
                        <div className="flex items-center gap-1 text-xs text-white/30">
                          <TrendingUp className="w-3 h-3" /> 10yr alpha: <span className="text-white/60 font-medium ml-1">{them?.alpha_10yr ?? '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'behavioral' && (
            <div>
              <p className="text-xs text-white/30 mb-6">Behavioral fingerprint comparison across 6 decision-making dimensions. Derived from lifetime allocation history.</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={behavioralProfile}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="trait" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                    <Radar name="You" dataKey="you" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.15} strokeWidth={2} />
                    <Radar name={members.find(m => m.key === selectedMember)?.name} dataKey={selectedMember}
                      stroke={members.find(m => m.key === selectedMember)?.color}
                      fill={members.find(m => m.key === selectedMember)?.color} fillOpacity={0.1} strokeWidth={2} />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: 'Most Similar Trait', value: 'Patience', sub: 'Within 15 pts of Charles' },
                  { label: 'Biggest Divergence', value: 'Concentration', sub: 'You: 58 · Charles: 90' },
                  { label: 'Lineage Match Score', value: '74%', sub: 'Closest to Edward W. Jr.' },
                ].map((s, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <div className="text-xs text-white/30 mb-1">{s.label}</div>
                    <div className="text-lg font-bold text-violet-300">{s.value}</div>
                    <div className="text-xs text-white/20 mt-1">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'trajectory' && (
            <div>
              <p className="text-xs text-white/30 mb-6">Indexed portfolio trajectory (base 100 = year 2000 equivalent). Each line reflects actual historical decisions made by that member.</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioTrajectory}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 12 }}
                      formatter={(v, name) => [v ? `${v}x` : 'N/A', name]}
                    />
                    <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                    {members.map(m => (
                      <Line key={m.key} type="monotone" dataKey={m.key} name={m.name}
                        stroke={m.color} strokeWidth={m.key === 'you' ? 2.5 : 1.5}
                        dot={false} connectNulls={false}
                        strokeDasharray={m.key === 'you' ? undefined : '4 2'}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300/60 leading-relaxed">
                <strong className="text-amber-400">Insight:</strong> Charles H. III's 2008 concentration strategy created the largest single-decade alpha in the family's recorded history (+310 indexed vs. your +98).
                His behavioral tag "crisis_concentrate" appears in 3 of the 5 highest-alpha decisions on record. Your 2020 tech accumulation was the closest behavioral match.
              </div>
            </div>
          )}

        </div>

        <div className="px-6 pb-5 flex items-center justify-between">
          <p className="text-xs text-white/20">Demo data only · Real engine requires encrypted family archive upload</p>
          <Button onClick={onClose} variant="outline" size="sm" className="border-white/10 text-white/40 hover:text-white hover:bg-white/5">
            Close Demo
          </Button>
        </div>
      </div>
    </div>
  );
}