import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, TrendingUp, TrendingDown, Coins, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const assetTypes = ['tokenized_treasury', 'tokenized_equity', 'real_estate', 'private_equity', 'xrp', 'stablecoin', 'insurance_policy', 'art', 'commodities', 'other'];
const typeColors = {
  tokenized_treasury: '#f59e0b',
  tokenized_equity: '#3b82f6',
  real_estate: '#8b5cf6',
  private_equity: '#10b981',
  xrp: '#06b6d4',
  stablecoin: '#22c55e',
  insurance_policy: '#f97316',
  art: '#ec4899',
  commodities: '#a78bfa',
  other: '#6b7280',
};

const providers = ['Ondo Finance', 'BlackRock', 'Franklin Templeton', 'Securitize', 'Backed Finance', 'Maple Finance', 'Goldfinch', 'Other'];

const fmt = (n) => n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n ? `$${n.toLocaleString()}` : '—';

export default function Portfolio() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => {
    base44.entities.AssetHolding.list('-created_date').then(a => { setAssets(a); setLoading(false); });
  };
  useEffect(load, []);

  const totalValue = assets.reduce((s, a) => s + (a.total_value_usd || 0), 0);

  const pieData = Object.entries(
    assets.reduce((acc, a) => {
      acc[a.asset_type] = (acc[a.asset_type] || 0) + (a.total_value_usd || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value, type: name }));

  const save = async () => {
    setSaving(true);
    const data = { ...form, total_value_usd: (form.quantity || 0) * (form.unit_price_usd || 0) };
    if (selected) await base44.entities.AssetHolding.update(selected.id, data);
    else await base44.entities.AssetHolding.create(data);
    setSaving(false);
    setOpen(false);
    load();
  };

  const filtered = assets.filter(a =>
    !search || a.asset_name?.toLowerCase().includes(search.toLowerCase()) || a.provider?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-white/40 text-sm mt-1">Real World Assets, Digital Holdings & Tokenized Instruments</p>
        </div>
        <Button onClick={() => { setForm({}); setSelected(null); setOpen(true); }} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> Add Asset
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="col-span-1 sm:col-span-2 p-6 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="text-xs text-white/30 mb-1">Total Portfolio Value</div>
          <div className="text-4xl font-bold text-amber-300 mb-2">{fmt(totalValue)}</div>
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <TrendingUp className="w-4 h-4" /> +12.4% this year
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="text-xs text-white/30 mb-1">Asset Classes</div>
          <div className="text-4xl font-bold text-white mb-2">{pieData.length}</div>
          <div className="text-sm text-white/30">{assets.length} total holdings</div>
        </div>
      </div>

      {/* Chart + Table */}
      <div className="grid lg:grid-cols-5 gap-6">
        {assets.length > 0 && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.03] border border-white/5">
            <h2 className="font-semibold text-white mb-4">Allocation</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={typeColors[entry.type] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0d1425', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                  formatter={(v) => [fmt(v)]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: typeColors[d.type] || '#6b7280' }} />
                    <span className="text-white/50 capitalize">{d.name}</span>
                  </div>
                  <span className="text-white/40">{totalValue ? ((d.value / totalValue) * 100).toFixed(1) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`${assets.length > 0 ? 'lg:col-span-3' : 'lg:col-span-5'} space-y-3`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="Search assets..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Coins className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30">No assets added yet</p>
              <Button onClick={() => { setForm({}); setSelected(null); setOpen(true); }} className="mt-4 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold">
                Add First Asset
              </Button>
            </div>
          ) : (
            filtered.map((a) => (
              <div
                key={a.id}
                onClick={() => { setForm(a); setSelected(a); setOpen(true); }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: typeColors[a.asset_type] || '#6b7280' }} />
                  <div>
                    <div className="text-sm font-medium text-white">{a.asset_name}</div>
                    <div className="text-xs text-white/30 capitalize">{a.provider || a.asset_type?.replace(/_/g, ' ')} · {a.chain || 'Off-chain'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{fmt(a.total_value_usd)}</div>
                  {a.yield_apy && <div className="text-xs text-emerald-400">+{a.yield_apy}% APY</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ondo Finance callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 to-emerald-950/30 border border-emerald-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="font-semibold text-white mb-1">Ondo Finance Integration</div>
            <p className="text-sm text-white/50">Access tokenized US Treasuries (OUSG), Short-Term US Government Bond Fund (OSTB), and Ondo Short-Term US Government (ONDO) — institutional-grade RWAs with real yield, directly in your vault.</p>
            <div className="flex gap-3 mt-3">
              {['OUSG · 5.2% APY', 'OSTB · 5.0% APY', 'USDY · 5.35% APY'].map((p, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0d1425] border border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{selected ? 'Edit Asset' : 'Add Asset Holding'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Asset Name</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="e.g. OUSG — Ondo US Treasury" value={form.asset_name || ''} onChange={e => setForm({...form, asset_name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Asset Type</Label>
                <Select value={form.asset_type || ''} onValueChange={v => setForm({...form, asset_type: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {assetTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Provider</Label>
                <Select value={form.provider || ''} onValueChange={v => setForm({...form, provider: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Provider" /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {providers.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Quantity</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white" placeholder="0" value={form.quantity || ''} onChange={e => setForm({...form, quantity: parseFloat(e.target.value)})} />
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Unit Price (USD)</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white" placeholder="0.00" value={form.unit_price_usd || ''} onChange={e => setForm({...form, unit_price_usd: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Yield APY (%)</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white" placeholder="0.00" value={form.yield_apy || ''} onChange={e => setForm({...form, yield_apy: parseFloat(e.target.value)})} />
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Chain</Label>
                <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="e.g. Ethereum, XRPL" value={form.chain || ''} onChange={e => setForm({...form, chain: e.target.value})} />
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Token Symbol</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono" placeholder="e.g. OUSG, BUIDL" value={form.token_symbol || ''} onChange={e => setForm({...form, token_symbol: e.target.value})} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-white/10 text-white/60 hover:text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold">
                {saving ? 'Saving...' : selected ? 'Update' : 'Add Asset'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}