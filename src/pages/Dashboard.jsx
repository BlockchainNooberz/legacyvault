import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Shield, FileCode2, CreditCard, ChevronRight, Vault, Activity, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const portfolioData = [
  { month: 'Jan', value: 12400000 },
  { month: 'Feb', value: 13100000 },
  { month: 'Mar', value: 12800000 },
  { month: 'Apr', value: 14200000 },
  { month: 'May', value: 15600000 },
  { month: 'Jun', value: 15100000 },
  { month: 'Jul', value: 16800000 },
  { month: 'Aug', value: 18200000 },
];

const fmt = (n) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${n.toLocaleString()}`;

export default function Dashboard() {
  const [vaults, setVaults] = useState([]);
  const [assets, setAssets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stipulations, setStipulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.TrustVault.list('-created_date', 5),
      base44.entities.AssetHolding.list('-created_date', 10),
      base44.entities.Payment.list('-created_date', 5),
      base44.entities.Stipulation.list('-created_date', 5),
    ]).then(([v, a, p, s]) => {
      setVaults(v);
      setAssets(a);
      setPayments(p);
      setStipulations(s);
      setLoading(false);
    });
  }, []);

  const totalAssets = assets.reduce((s, a) => s + (a.total_value_usd || 0), 0);
  const activeVaults = vaults.filter(v => v.status === 'active').length;
  const pendingStipulations = stipulations.filter(s => s.status === 'pending').length;

  const stats = [
    { icon: TrendingUp, label: 'Total Portfolio Value', value: fmt(totalAssets || 18200000), sub: '+12.4% this year', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Shield, label: 'Active Trust Vaults', value: activeVaults || 3, sub: 'Across 2 jurisdictions', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: FileCode2, label: 'Live Smart Contracts', value: 7, sub: 'XRPL & Ethereum', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: AlertCircle, label: 'Pending Stipulations', value: pendingStipulations || 4, sub: 'Awaiting milestones', color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Family Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Sovereign Tier · XRPL Settlement Active</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-amber-400 text-sm font-medium">All Systems Active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
            <div className={`text-xs mt-2 ${s.color}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Portfolio Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">Portfolio Performance</h2>
              <p className="text-xs text-white/30 mt-0.5">Combined vault + RWA value</p>
            </div>
            <span className="text-emerald-400 text-sm font-medium">+47.2% YTD</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={portfolioData}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
                formatter={(v) => [fmt(v), 'Value']}
              />
              <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fill="url(#goldGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Asset breakdown */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
          <h2 className="font-semibold text-white mb-4">Asset Allocation</h2>
          <div className="space-y-3">
            {[
              { label: 'Tokenized Treasuries', pct: 38, color: 'bg-amber-400' },
              { label: 'Private Equity', pct: 24, color: 'bg-blue-400' },
              { label: 'Real Estate', pct: 18, color: 'bg-violet-400' },
              { label: 'XRP & Digital', pct: 12, color: 'bg-emerald-400' },
              { label: 'Commodities', pct: 8, color: 'bg-orange-400' },
            ].map((a, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/60">{a.label}</span>
                  <span className="text-white/40">{a.pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${a.color} rounded-full`} style={{ width: `${a.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vaults + Stipulations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Vaults */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Trust Vaults</h2>
            <Link to="/vaults" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          ) : vaults.length > 0 ? (
            <div className="space-y-3">
              {vaults.map((v) => (
                <Link to="/vaults" key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Vault className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{v.vault_name}</div>
                      <div className="text-xs text-white/30 capitalize">{v.trust_type} · {v.status}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">{fmt(v.total_value_usd || 0)}</div>
                    <div className="text-xs text-white/30 capitalize">{v.blockchain_protocol}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/20 text-sm">
              No vaults created yet.{' '}
              <Link to="/vaults" className="text-amber-400 hover:underline">Create your first vault</Link>
            </div>
          )}
        </div>

        {/* Stipulations */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Stipulation Monitor</h2>
            <Link to="/stipulations" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          ) : stipulations.length > 0 ? (
            <div className="space-y-3">
              {stipulations.map((s) => {
                const statusColors = { pending: 'text-amber-400 bg-amber-500/10', monitoring: 'text-blue-400 bg-blue-500/10', triggered: 'text-emerald-400 bg-emerald-500/10', fulfilled: 'text-white/30 bg-white/5' };
                const sc = statusColors[s.status] || statusColors.pending;
                return (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-violet-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{s.title}</div>
                        <div className="text-xs text-white/30 capitalize">{s.condition_type?.replace(/_/g, ' ')}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc}`}>
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-white/20 text-sm">
              No stipulations yet.{' '}
              <Link to="/stipulations" className="text-amber-400 hover:underline">Add stipulations</Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Recent XRP Transactions</h2>
          <Link to="/payments" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {payments.length > 0 ? (
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-white/20" />
                  <div>
                    <div className="text-sm text-white">{p.description || p.payment_type?.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-white/30">{p.payment_date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-amber-400">{p.amount_xrp} XRP</div>
                  <div className={`text-xs ${p.status === 'confirmed' ? 'text-emerald-400' : 'text-amber-400'}`}>{p.status}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-white/20 text-sm">No payments recorded yet.</div>
        )}
      </div>
    </div>
  );
}