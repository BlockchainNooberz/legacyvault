import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, CreditCard, Copy, CheckCircle2, ExternalLink, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const statusColors = {
  pending: 'text-amber-400 bg-amber-500/10',
  confirmed: 'text-emerald-400 bg-emerald-500/10',
  failed: 'text-red-400 bg-red-500/10',
  refunded: 'text-blue-400 bg-blue-500/10',
};

const VAULTIS_WALLET = 'rVaultisXXXXXXXXXXXXXXXXXXXXXXXXXX';

const tiers = {
  obsidian: { monthly: 250, setup: 500 },
  sovereign: { monthly: 900, setup: 1500 },
  dynasty: { monthly: 2500, setup: 5000 },
};

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = () => {
    base44.entities.Payment.list('-created_date').then(p => { setPayments(p); setLoading(false); });
  };
  useEffect(load, []);

  const save = async () => {
    setSaving(true);
    await base44.entities.Payment.create({ ...form, to_wallet: VAULTIS_WALLET, payment_date: new Date().toISOString().split('T')[0] });
    setSaving(false);
    setOpen(false);
    load();
  };

  const totalXRP = payments.filter(p => p.status === 'confirmed').reduce((s, p) => s + (p.amount_xrp || 0), 0);

  const copyWallet = () => {
    navigator.clipboard.writeText(VAULTIS_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">XRP Payments</h1>
          <p className="text-white/40 text-sm mt-1">Membership fees & transaction settlements</p>
        </div>
        <Button onClick={() => { setForm({}); setOpen(true); }} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> Record Payment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Paid (XRP)', value: totalXRP.toLocaleString(), color: 'text-amber-400' },
          { label: 'Confirmed', value: payments.filter(p => p.status === 'confirmed').length, color: 'text-emerald-400' },
          { label: 'Pending', value: payments.filter(p => p.status === 'pending').length, color: 'text-amber-400' },
          { label: 'Total Transactions', value: payments.length, color: 'text-white' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-white/30 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Payment Address */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-900/20 to-amber-950/20 border border-amber-500/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-amber-400 uppercase tracking-wider font-medium mb-2">Vaultis XRP Payment Address</div>
            <div className="font-mono text-sm text-white/80 break-all">{VAULTIS_WALLET}</div>
            <p className="text-xs text-white/30 mt-2">Send XRP to this address for membership fees. Include your family ID in the memo field.</p>
          </div>
          <Button onClick={copyWallet} variant="outline" size="sm" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 flex-shrink-0">
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Tier pricing */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(tiers).map(([tier, pricing]) => (
          <div key={tier} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-xs text-white/30 uppercase tracking-wider mb-2 capitalize">{tier}</div>
            <div className="text-xl font-bold text-amber-300">{pricing.monthly} XRP</div>
            <div className="text-xs text-white/20 mt-1">per month</div>
            <div className="text-xs text-white/30 mt-2">Setup: {pricing.setup} XRP</div>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="font-semibold text-white">Transaction History</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <Coins className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No payments recorded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-white/20 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-white capitalize">{p.payment_type?.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-white/30">{p.payment_date} · {p.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {p.xrp_tx_hash && (
                    <a href={`https://xrpscan.com/tx/${p.xrp_tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/50">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <div className="text-right">
                    <div className="text-sm font-semibold text-amber-300">{p.amount_xrp} XRP</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[p.status] || statusColors.pending}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0d1425] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Record XRP Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Payment Type</Label>
              <Select value={form.payment_type || ''} onValueChange={v => setForm({...form, payment_type: v})}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                  {['monthly_membership','per_transaction','vault_setup','contract_deployment','advisory'].map(t => (
                    <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Amount (XRP)</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white" placeholder="0.00" value={form.amount_xrp || ''} onChange={e => setForm({...form, amount_xrp: parseFloat(e.target.value)})} />
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Status</Label>
                <Select value={form.status || 'pending'} onValueChange={v => setForm({...form, status: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {['pending','confirmed','failed','refunded'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">TX Hash (optional)</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono text-sm" placeholder="XRPL transaction hash" value={form.xrp_tx_hash || ''} onChange={e => setForm({...form, xrp_tx_hash: e.target.value})} />
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">From Wallet</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono text-sm" placeholder="Sender XRP address" value={form.from_wallet || ''} onChange={e => setForm({...form, from_wallet: e.target.value})} />
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Description</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="e.g. June membership — Sovereign tier" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-white/10 text-white/60 hover:text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold">
                {saving ? 'Saving...' : 'Record Payment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}