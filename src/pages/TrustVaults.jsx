import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Vault, Shield, ChevronRight, X, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const statusColors = {
  draft: 'text-white/40 bg-white/5',
  active: 'text-emerald-400 bg-emerald-500/10',
  locked: 'text-blue-400 bg-blue-500/10',
  distributing: 'text-amber-400 bg-amber-500/10',
  closed: 'text-red-400 bg-red-500/10',
};

const trustTypes = ['revocable', 'irrevocable', 'dynasty', 'charitable', 'spendthrift', 'blind'];
const protocols = ['xrpl', 'ethereum', 'polygon', 'stellar'];
const schedules = ['monthly', 'quarterly', 'annually', 'milestone', 'on_demand'];

export default function TrustVaults() {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    base44.entities.TrustVault.list('-created_date').then(v => { setVaults(v); setLoading(false); });
  };
  useEffect(load, []);

  const openNew = () => { setForm({}); setSelected(null); setOpen(true); };
  const openEdit = (v) => { setForm(v); setSelected(v); setOpen(true); };

  const save = async () => {
    setSaving(true);
    if (selected) {
      await base44.entities.TrustVault.update(selected.id, form);
    } else {
      await base44.entities.TrustVault.create(form);
    }
    setSaving(false);
    setOpen(false);
    load();
  };

  const fmt = (n) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n ? `$${n.toLocaleString()}` : '—';

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trust Vaults</h1>
          <p className="text-white/40 text-sm mt-1">Tokenized trust structures on permanent protocols</p>
        </div>
        <Button onClick={openNew} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> New Vault
        </Button>
      </div>

      {/* Info banner */}
      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex gap-3">
        <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-white/60">
          Trust vaults are tokenized on your chosen blockchain protocol. Dynasty and Irrevocable trusts encoded on XRPL or Ethereum are immutable once deployed. Work with your legal advisor before finalizing.
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : vaults.length === 0 ? (
        <div className="text-center py-20">
          <Vault className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-lg">No vaults created yet</p>
          <p className="text-white/20 text-sm mt-1">Create your first trust vault to begin tokenizing generational wealth</p>
          <Button onClick={openNew} className="mt-6 bg-amber-500 hover:bg-amber-400 text-black font-semibold">
            <Plus className="w-4 h-4 mr-2" /> Create Vault
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {vaults.map((v) => (
            <div
              key={v.id}
              onClick={() => openEdit(v)}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 hover:bg-white/[0.05] transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Vault className="w-5 h-5 text-amber-400" />
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[v.status] || statusColors.draft}`}>
                  {v.status}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1">{v.vault_name}</h3>
              <p className="text-xs text-white/30 capitalize mb-3">{v.trust_type} trust · {v.blockchain_protocol?.toUpperCase()}</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-amber-300">{fmt(v.total_value_usd)}</div>
                  <div className="text-xs text-white/20">Total Value</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/50 capitalize">{v.distribution_schedule?.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-white/20">Distribution</div>
                </div>
              </div>
              {v.tokenized && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
                  <Coins className="w-3 h-3" /> Tokenized on-chain
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0d1425] border border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{selected ? 'Edit Vault' : 'Create Trust Vault'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Vault Name</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="e.g. Wellington Dynasty Trust" value={form.vault_name || ''} onChange={e => setForm({...form, vault_name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Trust Type</Label>
                <Select value={form.trust_type || ''} onValueChange={v => setForm({...form, trust_type: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {trustTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Protocol</Label>
                <Select value={form.blockchain_protocol || ''} onValueChange={v => setForm({...form, blockchain_protocol: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select chain" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {protocols.map(p => <SelectItem key={p} value={p} className="uppercase">{p.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Total Value (USD)</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="0" value={form.total_value_usd || ''} onChange={e => setForm({...form, total_value_usd: parseFloat(e.target.value)})} />
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Status</Label>
                <Select value={form.status || 'draft'} onValueChange={v => setForm({...form, status: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {['draft','active','locked','distributing','closed'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Distribution Schedule</Label>
              <Select value={form.distribution_schedule || ''} onValueChange={v => setForm({...form, distribution_schedule: v})}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                  {schedules.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Legal Jurisdiction</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="e.g. Cayman Islands, Delaware, Singapore" value={form.legal_jurisdiction || ''} onChange={e => setForm({...form, legal_jurisdiction: e.target.value})} />
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Smart Contract Address (optional)</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono text-sm" placeholder="0x..." value={form.smart_contract_address || ''} onChange={e => setForm({...form, smart_contract_address: e.target.value})} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="tokenized" checked={!!form.tokenized} onChange={e => setForm({...form, tokenized: e.target.checked})} className="accent-amber-500" />
              <Label htmlFor="tokenized" className="text-white/60 text-sm cursor-pointer">Vault is tokenized on-chain</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-white/10 text-white/60 hover:text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold">
                {saving ? 'Saving...' : selected ? 'Update Vault' : 'Create Vault'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}