import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { FileCode2, Shield, ExternalLink, Plus, Search, Filter, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const categoryColors = {
  inheritance: 'text-amber-400 bg-amber-500/10',
  vesting: 'text-blue-400 bg-blue-500/10',
  escrow: 'text-violet-400 bg-violet-500/10',
  multi_sig: 'text-emerald-400 bg-emerald-500/10',
  rwa_tokenization: 'text-pink-400 bg-pink-500/10',
  insurance: 'text-orange-400 bg-orange-500/10',
  charitable: 'text-teal-400 bg-teal-500/10',
  governance: 'text-indigo-400 bg-indigo-500/10',
};

const riskColors = { low: 'text-emerald-400', moderate: 'text-amber-400', elevated: 'text-red-400' };

const categories = ['inheritance', 'vesting', 'escrow', 'multi_sig', 'rwa_tokenization', 'insurance', 'charitable', 'governance'];
const protocols = ['xrpl', 'ethereum', 'polygon', 'stellar', 'algorand'];

export default function SmartContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    base44.entities.SmartContractTemplate.list('-created_date').then(c => { setContracts(c); setLoading(false); });
  };
  useEffect(load, []);

  const filtered = contracts.filter(c => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || c.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const save = async () => {
    setSaving(true);
    if (selected) await base44.entities.SmartContractTemplate.update(selected.id, form);
    else await base44.entities.SmartContractTemplate.create(form);
    setSaving(false);
    setOpen(false);
    load();
  };

  const openEdit = (c) => { setForm(c); setSelected(c); setOpen(true); };
  const openNew = () => { setForm({}); setSelected(null); setOpen(true); };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Smart Contract Library</h1>
          <p className="text-white/40 text-sm mt-1">Vetted, institutional-grade contracts for generational wealth</p>
        </div>
        <Button onClick={openNew} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> Add Contract
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <Input className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="Search contracts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
            <Filter className="w-4 h-4 mr-2 text-white/30" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0d1425] border-white/10 text-white">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace(/_/g, ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-52 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileCode2 className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30">No contracts found</p>
          <Button onClick={openNew} className="mt-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold">Add First Contract</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => openEdit(c)}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 hover:bg-white/[0.05] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${categoryColors[c.category] || 'text-white/40 bg-white/5'}`}>
                  {c.category?.replace(/_/g, ' ')}
                </span>
                {c.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
              </div>
              <h3 className="font-semibold text-white mb-1">{c.name}</h3>
              <p className="text-xs text-white/30 leading-relaxed mb-4 line-clamp-2">{c.description}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40 uppercase font-mono">{c.protocol}</span>
                <span className={`text-xs font-medium ${riskColors[c.risk_rating] || 'text-white/30'}`}>
                  {c.risk_rating} risk
                </span>
                {c.audit_status === 'vetted' && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <Shield className="w-3 h-3" /> Vetted
                  </span>
                )}
              </div>
              {c.tvl_usd && (
                <div className="mt-3 text-xs text-white/20">
                  TVL: ${(c.tvl_usd / 1e9).toFixed(1)}B
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
            <DialogTitle className="text-white">{selected ? 'Edit Contract' : 'Add Smart Contract'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Contract Name</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="e.g. XRP Dynasty Inheritance Escrow" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Category</Label>
                <Select value={form.category || ''} onValueChange={v => setForm({...form, category: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace(/_/g, ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Protocol</Label>
                <Select value={form.protocol || ''} onValueChange={v => setForm({...form, protocol: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Protocol" /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {protocols.map(p => <SelectItem key={p} value={p} className="uppercase">{p.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Description</Label>
              <Textarea className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none" rows={3} placeholder="What does this contract do?" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Risk Rating</Label>
                <Select value={form.risk_rating || 'low'} onValueChange={v => setForm({...form, risk_rating: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {['low','moderate','elevated'].map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Audit Status</Label>
                <Select value={form.audit_status || 'vetted'} onValueChange={v => setForm({...form, audit_status: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {['vetted','pending_audit','community_reviewed'].map(a => <SelectItem key={a} value={a} className="capitalize">{a.replace(/_/g, ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">Auditor</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="e.g. Trail of Bits, OpenZeppelin" value={form.auditor || ''} onChange={e => setForm({...form, auditor: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Protocol Age (years)</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white" placeholder="e.g. 10" value={form.protocol_age_years || ''} onChange={e => setForm({...form, protocol_age_years: parseFloat(e.target.value)})} />
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">TVL (USD)</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white" placeholder="e.g. 5000000000" value={form.tvl_usd || ''} onChange={e => setForm({...form, tvl_usd: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={!!form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="accent-amber-500" />
              <Label htmlFor="featured" className="text-white/60 text-sm cursor-pointer">Feature in library</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-white/10 text-white/60 hover:text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold">
                {saving ? 'Saving...' : selected ? 'Update' : 'Add Contract'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}