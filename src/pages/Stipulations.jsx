import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Shield, Activity, Lock, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const conditionTypes = ['age_milestone', 'education', 'marriage', 'employment', 'sobriety', 'time_lock', 'performance', 'custom'];
const conditionIcons = {
  age_milestone: Clock, education: Shield, marriage: Activity,
  employment: Activity, sobriety: Lock, time_lock: Lock, performance: TrendingUp, custom: Shield,
};

const statusConfig = {
  pending: { label: 'Pending', color: 'text-amber-400 bg-amber-500/10' },
  monitoring: { label: 'Monitoring', color: 'text-blue-400 bg-blue-500/10' },
  triggered: { label: 'Triggered', color: 'text-violet-400 bg-violet-500/10' },
  fulfilled: { label: 'Fulfilled', color: 'text-emerald-400 bg-emerald-500/10' },
  voided: { label: 'Voided', color: 'text-white/20 bg-white/5' },
};

import { TrendingUp } from 'lucide-react';

export default function Stipulations() {
  const [stips, setStips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    base44.entities.Stipulation.list('-created_date').then(s => { setStips(s); setLoading(false); });
  };
  useEffect(load, []);

  const save = async () => {
    setSaving(true);
    if (selected) await base44.entities.Stipulation.update(selected.id, form);
    else await base44.entities.Stipulation.create(form);
    setSaving(false);
    setOpen(false);
    load();
  };

  const fmt = (n) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n ? `$${n.toLocaleString()}` : null;

  const grouped = conditionTypes.reduce((acc, t) => {
    acc[t] = stips.filter(s => s.condition_type === t);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Stipulation Engine</h1>
          <p className="text-white/40 text-sm mt-1">Encode parental intent. Conditions that live on-chain forever.</p>
        </div>
        <Button onClick={() => { setForm({}); setSelected(null); setOpen(true); }} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> New Stipulation
        </Button>
      </div>

      {/* Info */}
      <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20 flex gap-3">
        <Lock className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-white/60">
          Stipulations are conditions that must be met before funds are released to a beneficiary. Once encoded as smart contracts, they are immutable and automatically enforced — no trustee required.
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusConfig).map(([status, cfg]) => {
          const count = stips.filter(s => s.status === status).length;
          return (
            <div key={status} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className={`text-xs mt-1 ${cfg.color.split(' ')[0]}`}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}</div>
      ) : stips.length === 0 ? (
        <div className="text-center py-20">
          <Lock className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-lg">No stipulations created yet</p>
          <p className="text-white/20 text-sm mt-1">Define conditions that must be met before beneficiaries receive funds</p>
          <Button onClick={() => { setForm({}); setSelected(null); setOpen(true); }} className="mt-6 bg-amber-500 hover:bg-amber-400 text-black font-semibold">
            Create First Stipulation
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {stips.map((s) => {
            const sc = statusConfig[s.status] || statusConfig.pending;
            const Icon = conditionIcons[s.condition_type] || Shield;
            return (
              <div
                key={s.id}
                onClick={() => { setForm(s); setSelected(s); setOpen(true); }}
                className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{s.title}</div>
                    <div className="text-xs text-white/30 mt-0.5 capitalize">
                      {s.condition_type?.replace(/_/g, ' ')}
                      {s.condition_description && ` · ${s.condition_description}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {fmt(s.release_amount_usd) && (
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-semibold text-amber-300">{fmt(s.release_amount_usd)}</div>
                      {s.release_percentage && <div className="text-xs text-white/30">{s.release_percentage}% of vault</div>}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {s.smart_contract_encoded && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> On-chain
                      </span>
                    )}
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.color}`}>
                      {sc.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0d1425] border border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{selected ? 'Edit Stipulation' : 'New Stipulation'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Stipulation Title</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="e.g. Must complete university degree" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Condition Type</Label>
                <Select value={form.condition_type || ''} onValueChange={v => setForm({...form, condition_type: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {conditionTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Status</Label>
                <Select value={form.status || 'pending'} onValueChange={v => setForm({...form, status: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {Object.keys(statusConfig).map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Condition Description</Label>
              <Textarea className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none" rows={2} placeholder="Describe the exact condition..." value={form.condition_description || ''} onChange={e => setForm({...form, condition_description: e.target.value})} />
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Trigger Value</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="e.g. Age 25, Bachelor's degree, 5 years employed" value={form.trigger_value || ''} onChange={e => setForm({...form, trigger_value: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Release Amount (USD)</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white" placeholder="0" value={form.release_amount_usd || ''} onChange={e => setForm({...form, release_amount_usd: parseFloat(e.target.value)})} />
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Release % of Vault</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white" placeholder="0-100" max="100" value={form.release_percentage || ''} onChange={e => setForm({...form, release_percentage: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Release Schedule</Label>
              <Select value={form.release_schedule || 'lump_sum'} onValueChange={v => setForm({...form, release_schedule: v})}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                  {['lump_sum','monthly','quarterly','annually'].map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="onchain" checked={!!form.smart_contract_encoded} onChange={e => setForm({...form, smart_contract_encoded: e.target.checked})} className="accent-amber-500" />
              <Label htmlFor="onchain" className="text-white/60 text-sm cursor-pointer">Encoded as smart contract on-chain</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-white/10 text-white/60 hover:text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold">
                {saving ? 'Saving...' : selected ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}