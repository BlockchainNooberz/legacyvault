import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Users, Crown, User, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const roleIcons = { patriarch: Crown, matriarch: Crown, beneficiary: User, advisor: Shield };
const roleColors = {
  patriarch: 'text-amber-400 bg-amber-500/10',
  matriarch: 'text-amber-400 bg-amber-500/10',
  beneficiary: 'text-blue-400 bg-blue-500/10',
  advisor: 'text-emerald-400 bg-emerald-500/10',
};
const tierColors = {
  obsidian: 'text-slate-300 bg-slate-700/30',
  sovereign: 'text-amber-300 bg-amber-700/20',
  dynasty: 'text-violet-300 bg-violet-700/20',
};

export default function Family() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    base44.entities.Member.list('-created_date').then(m => { setMembers(m); setLoading(false); });
  };
  useEffect(load, []);

  const save = async () => {
    setSaving(true);
    if (selected) await base44.entities.Member.update(selected.id, form);
    else await base44.entities.Member.create(form);
    setSaving(false);
    setOpen(false);
    load();
  };

  const grouped = {
    patriarch: members.filter(m => m.role === 'patriarch'),
    matriarch: members.filter(m => m.role === 'matriarch'),
    beneficiary: members.filter(m => m.role === 'beneficiary'),
    advisor: members.filter(m => m.role === 'advisor'),
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Family Members</h1>
          <p className="text-white/40 text-sm mt-1">Manage principals, beneficiaries, and advisors</p>
        </div>
        <Button onClick={() => { setForm({}); setSelected(null); setOpen(true); }} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> Add Member
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}</div>
      ) : members.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-lg">No family members added</p>
          <Button onClick={() => { setForm({}); setSelected(null); setOpen(true); }} className="mt-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold">
            Add First Member
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([role, roleMembers]) => {
            if (roleMembers.length === 0) return null;
            const Icon = roleIcons[role] || User;
            return (
              <div key={role}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-white/30" />
                  <h2 className="text-sm font-medium text-white/40 capitalize">{role}s ({roleMembers.length})</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {roleMembers.map((m) => {
                    const MIcon = roleIcons[m.role] || User;
                    return (
                      <div
                        key={m.id}
                        onClick={() => { setForm(m); setSelected(m); setOpen(true); }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 hover:bg-white/[0.05] transition-all cursor-pointer"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${roleColors[m.role] || 'text-white/30 bg-white/5'}`}>
                          {m.avatar_url ? (
                            <img src={m.avatar_url} alt={m.full_name} className="w-full h-full rounded-xl object-cover" />
                          ) : (
                            <MIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate">{m.full_name}</div>
                          <div className="text-xs text-white/30 truncate">{m.email}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${tierColors[m.membership_tier] || ''}`}>
                            {m.membership_tier}
                          </span>
                          {m.kyc_verified && <span className="text-xs text-emerald-400 flex items-center gap-1"><Shield className="w-3 h-3" /> KYC</span>}
                        </div>
                      </div>
                    );
                  })}
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
            <DialogTitle className="text-white">{selected ? 'Edit Member' : 'Add Family Member'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Full Name</Label>
                <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="Full name" value={form.full_name || ''} onChange={e => setForm({...form, full_name: e.target.value})} />
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Email</Label>
                <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="Email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Role</Label>
                <Select value={form.role || 'beneficiary'} onValueChange={v => setForm({...form, role: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {['patriarch','matriarch','beneficiary','advisor'].map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Membership Tier</Label>
                <Select value={form.membership_tier || 'obsidian'} onValueChange={v => setForm({...form, membership_tier: v})}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0d1425] border-white/10 text-white">
                    {['obsidian','sovereign','dynasty'].map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs mb-1.5 block">XRP Wallet Address</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono text-sm" placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" value={form.xrp_wallet_address || ''} onChange={e => setForm({...form, xrp_wallet_address: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Nationality</Label>
                <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="e.g. Swiss, American" value={form.nationality || ''} onChange={e => setForm({...form, nationality: e.target.value})} />
              </div>
              <div>
                <Label className="text-white/60 text-xs mb-1.5 block">Date of Birth</Label>
                <Input type="date" className="bg-white/5 border-white/10 text-white" value={form.date_of_birth || ''} onChange={e => setForm({...form, date_of_birth: e.target.value})} />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="kyc" checked={!!form.kyc_verified} onChange={e => setForm({...form, kyc_verified: e.target.checked})} className="accent-amber-500" />
                <Label htmlFor="kyc" className="text-white/60 text-sm cursor-pointer">KYC Verified</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="twofa" checked={!!form.two_factor_enabled} onChange={e => setForm({...form, two_factor_enabled: e.target.checked})} className="accent-amber-500" />
                <Label htmlFor="twofa" className="text-white/60 text-sm cursor-pointer">2FA Enabled</Label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-white/10 text-white/60 hover:text-white hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold">
                {saving ? 'Saving...' : selected ? 'Update' : 'Add Member'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}