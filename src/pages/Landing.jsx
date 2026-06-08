import { Link } from 'react-router-dom';
import { Shield, Layers, Globe, ChevronRight, Lock, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tiers = [
  {
    name: 'Obsidian',
    price: '250 XRP',
    period: '/month',
    color: 'from-slate-700 to-slate-900',
    border: 'border-slate-600',
    features: ['Family dashboard', 'Up to 3 beneficiaries', 'Smart contract library access', 'Basic stipulation builder', 'XRP payment tracking'],
  },
  {
    name: 'Sovereign',
    price: '900 XRP',
    period: '/month',
    color: 'from-amber-700 to-yellow-900',
    border: 'border-amber-500',
    featured: true,
    features: ['Everything in Obsidian', 'Up to 10 beneficiaries', 'Ondo Finance RWA integration', 'Tokenized trust deployment', 'Multi-sig governance', 'Priority advisory access'],
  },
  {
    name: 'Dynasty',
    price: '2,500 XRP',
    period: '/month',
    color: 'from-violet-800 to-purple-950',
    border: 'border-violet-500',
    features: ['Everything in Sovereign', 'Unlimited beneficiaries', 'Custom smart contract deployment', 'Insurance policy tokenization', 'White-glove onboarding', 'Dedicated wealth advisor', 'Cross-chain asset management'],
  },
];

const pillars = [
  { icon: Shield, title: 'Trust Vaults', desc: 'Tokenized irrevocable and dynasty trusts encoded on XRPL and Ethereum — immutable, auditable, built to outlast generations.' },
  { icon: Layers, title: 'Smart Contract Library', desc: 'Vetted inheritance, vesting, escrow, and multi-sig contracts. Every protocol chosen for 20+ year viability.' },
  { icon: TrendingUp, title: 'Ondo Finance RWAs', desc: 'Tokenized US Treasuries, money market funds, and institutional-grade bonds. Yield that preserves purchasing power.' },
  { icon: Lock, title: 'Stipulation Engine', desc: 'Encode parental intent on-chain. Age locks, education milestones, sobriety clauses — automated and tamper-proof.' },
  { icon: Zap, title: 'XRP Settlement', desc: 'Sub-second, nearly feeless cross-border payments. Move generational wealth anywhere, instantly.' },
  { icon: Globe, title: 'Multi-Jurisdiction', desc: 'Support for trusts across US, Cayman, Singapore, UAE, Switzerland and beyond.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050810] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#050810]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-black font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Vaultis</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#pillars" className="hover:text-white transition-colors">Platform</a>
            <a href="#tiers" className="hover:text-white transition-colors">Membership</a>
            <a href="#protocol" className="hover:text-white transition-colors">Protocol</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-white/70 hover:text-white text-sm">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-5">
                Request Access
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute inset-0 bg-gradient-radial from-amber-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-8 tracking-wider uppercase">
            Private · Institutional · Generational
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Generational Wealth,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">
              Encoded On-Chain
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Vaultis is the private platform for ultra-high-net-worth families to tokenize trusts, 
            deploy vetted smart contracts, and pass wealth to the next generation — with stipulations that last forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-6 text-base rounded-xl">
                Access the Platform <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/contracts">
              <Button variant="outline" className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 px-8 py-6 text-base rounded-xl">
                View Smart Contract Library
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {[
            { value: '$4.2T+', label: 'Generational Wealth Addressed' },
            { value: 'XRPL', label: 'Primary Settlement Layer' },
            { value: '20yr+', label: 'Protocol Viability Standard' },
            { value: 'Ondo', label: 'RWA Partner' },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.03] px-6 py-6 text-center">
              <div className="text-2xl font-bold text-amber-400">{s.value}</div>
              <div className="text-xs text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section id="pillars" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Permanence</h2>
            <p className="text-white/40 max-w-xl mx-auto">Every layer of the platform is chosen for protocols that won't disappear in 20 years.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 hover:bg-white/[0.05] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <p.icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Membership Tiers</h2>
            <p className="text-white/40 max-w-xl mx-auto">Denominated in XRP. Settled in seconds. Recognized worldwide.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <div key={i} className={`relative rounded-2xl border ${tier.border} overflow-hidden ${tier.featured ? 'ring-2 ring-amber-500 scale-105' : ''}`}>
                {tier.featured && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600" />
                )}
                <div className={`bg-gradient-to-b ${tier.color} p-6`}>
                  {tier.featured && (
                    <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">Most Popular</div>
                  )}
                  <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-amber-300">{tier.price}</span>
                    <span className="text-white/50 text-sm">{tier.period}</span>
                  </div>
                </div>
                <div className="p-6 bg-white/[0.02] space-y-3">
                  {tier.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                  <Link to="/dashboard" className="block mt-6">
                    <Button className={`w-full ${tier.featured ? 'bg-amber-500 hover:bg-amber-400 text-black font-semibold' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Section */}
      <section id="protocol" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Protocol Partners</h2>
          <p className="text-white/40 mb-12">Integrated with the most durable, institutional-grade blockchain protocols on earth.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'XRP Ledger', desc: 'Settlement & Payments', color: 'text-blue-400' },
              { name: 'Ondo Finance', desc: 'Tokenized RWAs', color: 'text-green-400' },
              { name: 'Ethereum', desc: 'Smart Contracts', color: 'text-purple-400' },
              { name: 'Polygon', desc: 'Scalable Execution', color: 'text-violet-400' },
            ].map((p, i) => (
              <div key={i} className="p-5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className={`text-lg font-bold ${p.color} mb-1`}>{p.name}</div>
                <div className="text-xs text-white/30">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5 text-center text-white/20 text-sm">
        © {new Date().getFullYear()} Vaultis. Private Wealth Infrastructure. All rights reserved.
      </footer>
    </div>
  );
}