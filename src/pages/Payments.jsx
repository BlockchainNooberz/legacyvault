import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, CreditCard, Copy, CheckCircle2, ExternalLink, Coins, ChevronDown } from 'lucide-react';
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

const VAULTIS_WALLET = '0xVaultisXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

const tiers = {
  obsidian: { monthly: 250, setup: 500 },
  sovereign: { monthly: 900, setup: 1500 },
  dynasty: { monthly: 2500, setup: 5000 },
};

// All accepted payment tokens
const ACCEPTED_TOKENS = [
  // Stablecoins — USD
  { symbol: 'USDC', name: 'USD Coin', category: 'Stablecoin', color: 'text-blue-400' },
  { symbol: 'USDT', name: 'Tether USD', category: 'Stablecoin', color: 'text-green-400' },
  { symbol: 'PYUSD', name: 'PayPal USD', category: 'Stablecoin', color: 'text-indigo-400' },
  { symbol: 'FDUSD', name: 'First Digital USD', category: 'Stablecoin', color: 'text-cyan-400' },
  { symbol: 'DAI', name: 'Dai / USDS', category: 'Stablecoin', color: 'text-amber-400' },
  { symbol: 'RLUSD', name: 'Ripple USD', category: 'Stablecoin', color: 'text-blue-300' },
  { symbol: 'USD1', name: 'USD1 (WLFI)', category: 'Stablecoin', color: 'text-emerald-300' },
  { symbol: 'WLFI', name: 'World Liberty Financial', category: 'Stablecoin', color: 'text-violet-300' },
  { symbol: 'EURC', name: 'Euro Coin (Circle)', category: 'Stablecoin', color: 'text-blue-500' },
  // RWA / Yield-bearing
  { symbol: 'OUSG', name: 'Ondo US Treasury', category: 'RWA', color: 'text-emerald-400' },
  { symbol: 'USDY', name: 'Ondo US Dollar Yield', category: 'RWA', color: 'text-emerald-300' },
  { symbol: 'BUIDL', name: 'BlackRock USD Fund', category: 'RWA', color: 'text-slate-300' },
  { symbol: 'PAXG', name: 'PAX Gold', category: 'RWA', color: 'text-yellow-400' },
  // L1 Crypto
  { symbol: 'ETH', name: 'Ethereum', category: 'Crypto', color: 'text-purple-400' },
  { symbol: 'SOL', name: 'Solana', category: 'Crypto', color: 'text-violet-400' },
  { symbol: 'XRP', name: 'XRP', category: 'Crypto', color: 'text-blue-400' },
  { symbol: 'MATIC', name: 'Polygon', category: 'Crypto', color: 'text-violet-500' },
  { symbol: 'HBAR', name: 'Hedera', category: 'Crypto', color: 'text-emerald-500' },
  { symbol: 'XLM', name: 'Stellar', category: 'Crypto', color: 'text-sky-400' },
  { symbol: 'ZEC', name: 'Zcash', category: 'Crypto', color: 'text-amber-500' },
  { symbol: 'ROSE', name: 'Oasis Network', category: 'Crypto', color: 'text-pink-400' },
];

const categoryOrder = ['Stablecoin', 'RWA', 'Crypto'];

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ token: 'USDC' });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = () => {
    base44.entities.Payment.list('-created_date').then(p => { setPayments(p); setLoading(false); });
  };
  useEffect(load, []);

  const save = async () => {
    setSaving(true);
    await base44.entities.Payment.create({
      ...form,
      amount_xrp: form.amount_usdc, // reusing field for USDC equivalent amount
      to_wallet: VAULTIS_WALLET,
      payment_date: new Date().toISOString().split('T')[0],
      description: form.description || `${form.token} payment`,
    });
    setSaving(false);
    setOpen(false);
    load();
  };

  const totalUSDC = payments.filter(p => p.status === 'confirmed').reduce((s, p) => s + (p.amount_xrp || 0), 0);

  const copyWallet = () => {
    navigator.clipboard.writeText(VAULTIS_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
          <p className="text-white/40 text-sm mt-1">Membership fees & transaction settlements · 21 accepted tokens</p>
        </div>
        <Button onClick={() => { setForm({ token: 'USDC' }); setOpen(true); }} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> Record Payment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Paid (USD eq.)', value: `$${totalUSDC.toLocaleString()}`, color: 'text-amber-400' },
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
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/20 to-blue-950/20 border border-blue-500/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-blue-400 uppercase tracking-wider font-medium mb-2">Vaultis Payment Address (Multi-Chain)</div>
            <div className="font-mono text-sm text-white/80 break-all">{VAULTIS_WALLET}</div>
            <p className="text-xs text-white/30 mt-2">Send any accepted token to this address. Include your family ID in the memo/tag field. USDC on Ethereum preferred for fastest settlement.</p>
          </div>
          <Button onClick={copyWallet} variant="outline" size="sm" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 flex-shrink-0">
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Tier pricing */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(tiers).map(([tier, pricing]) => (
          <div key={tier} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-xs text-white/30 uppercase tracking-wider mb-2 capitalize">{tier}</div>
            <div className="text-xl font-bold text-amber-300">${pricing.monthly.toLocaleString()}</div>
            <div className="text-xs text-blue-400 font-medium">USDC / month</div>
            <div className="text-xs text-white/30 mt-2">Setup: ${pricing.setup.toLocaleString()} USDC</div>
          </div>
        ))}
      </div>

      {/* Accepted Tokens */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="font-semibold text-white">Accepted Payment Tokens</h2>
          <p className="text-xs text-white/30 mt-0.5">All prices denominated in USD · pay in any token below</p>
        </div>
        <div className="p-5 space-y-5">
          {categoryOrder.map(cat => (
            <div key={cat}>
              <div className="text-xs text-white/30 uppercase tracking-wider font-medium mb-3">{cat === 'Stablecoin' ? '🏦 Stablecoins & US Bank Issued' : cat === 'RWA' ? '📈 RWA & Yield-Bearing' : '⛓ L1 Networks'}</div>
              <div className="flex flex-wrap gap-2">
                {ACCEPTED_TOKENS.filter(t => t.category === cat).map(t => (
                  <div key={t.symbol} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/5 hover:border-white/10 transition-colors">
                    <span className={`text-xs font-bold ${t.color}`}>{t.symbol}</span>
                    <span className="text-xs text-white/30">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
                    <a href={`https://etherscan.io/tx/${p.xrp_tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/50">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <div className="text-right">
                    <div className="text-sm font-semibold text-amber-300">${p.amount_xrp} <span className="text-white/30 text-xs font-normal">USDC</span></div>
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
            <DialogTitle className="text-white">Record Payment</DialogTitle>
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
                <Label className="text-white/60 text-xs mb-1.5 block">Amount (USD)</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white" placeholder="0.00" value={form.amount_usdc || ''} onChange={e => setForm({...form, amount_usdc: parseFloat(e.target.value)})} />
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Token Used</Label>
                <Select value={form.token || 'USDC'} onValueChange={v => setForm({...form, token: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white max-h-56">
                    {categoryOrder.map(cat => (
                      <div key={cat}>
                        <div className="px-2 py-1 text-xs text-white/30 uppercase tracking-wider">{cat}</div>
                        {ACCEPTED_TOKENS.filter(t => t.category === cat).map(t => (
                          <SelectItem key={t.symbol} value={t.symbol}>
                            <span className="font-semibold">{t.symbol}</span> <span className="text-white/40 text-xs">{t.name}</span>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">TX Hash (optional)</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono text-sm" placeholder="Transaction hash" value={form.xrp_tx_hash || ''} onChange={e => setForm({...form, xrp_tx_hash: e.target.value})} />
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">From Wallet</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono text-sm" placeholder="Sender wallet address" value={form.from_wallet || ''} onChange={e => setForm({...form, from_wallet: e.target.value})} />
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