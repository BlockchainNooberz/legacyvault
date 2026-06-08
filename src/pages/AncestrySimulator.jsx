import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Upload, GitBranch, TrendingUp, Users, Lock, ChevronRight, Zap, BarChart3, Brain, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AncestryDemo from '@/components/ancestry/AncestryDemo';

const features = [
  {
    icon: Brain,
    title: 'Behavioral DNA Mapping',
    desc: 'The system extracts decision fingerprints from your family archive — risk tolerance under duress, diversification instincts, liquidity preferences — and builds a generational behavioral model.',
  },
  {
    icon: GitBranch,
    title: 'Decision Fork Analysis',
    desc: 'For any historical decision point, see how each family member responded and trace the 5-, 10-, 20-year performance delta of each path taken.',
  },
  {
    icon: TrendingUp,
    title: 'Performance Divergence',
    desc: 'Your decisions are scored against the family\'s historical decision DNA. Identify where you break pattern — and whether that divergence is creating or destroying generational alpha.',
  },
  {
    icon: Lock,
    title: 'Client-Side Encrypted Upload',
    desc: 'Your family archive never leaves your device unencrypted. Files are parsed locally, with optional encrypted storage in your private Vaultis vault.',
  },
  {
    icon: Clock,
    title: 'Temporal Overlay',
    desc: 'Map your current decisions onto historical macroeconomic backdrops. How would your 2024 portfolio have performed if built in 1929? In 1973? In 2008?',
  },
  {
    icon: Users,
    title: 'Multi-Generational Scoring',
    desc: 'Every family member gets a behavioral profile. See whose decision style you most closely inherit — and whose outcomes you should study most carefully.',
  },
];

export default function AncestrySimulator() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050810] text-white overflow-x-hidden">

      {/* Coming Soon Banner */}
      <div className="w-full bg-gradient-to-r from-violet-900/60 to-purple-900/40 border-b border-violet-500/20 py-2 px-6 text-center">
        <span className="text-xs text-violet-300 font-medium tracking-wider uppercase">
          ◆ Upcoming Feature · Dynasty Tier Early Access · Q3 2026
        </span>
      </div>

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-8 tracking-wider uppercase">
            <Zap className="w-3 h-3" /> Generational Decision Intelligence
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            Ancestry Decision<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-500">
              Comparison Engine
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto mb-4 leading-relaxed">
            Upload your family's financial history archive. The engine maps behavioral fingerprints across generations — 
            risk instincts, allocation patterns, crisis responses — and shows you exactly where your decisions align, 
            diverge, and what the performance delta looks like across time.
          </p>
          <p className="text-sm text-violet-300/60 max-w-2xl mx-auto mb-10">
            Not "what would your grandfather do" — but <em>here is what your lineage actually did under identical conditions, 
            and here is the measured outcome of every fork in the road.</em>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setDemoOpen(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-6 text-base rounded-xl gap-2"
            >
              <BarChart3 className="w-4 h-4" /> Explore Demo Dashboard
            </Button>
            <Button variant="outline" className="border-white/10 text-white/60 hover:text-white hover:bg-white/5 px-8 py-6 text-base rounded-xl gap-2">
              <Upload className="w-4 h-4" /> Notify Me at Launch
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-white/30 max-w-xl mx-auto text-sm">Three steps. Your family's decision history becomes a living analytical instrument.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Upload Family Archive',
                desc: 'Load a structured JSON or encrypted CSV file containing historical financial decisions, dates, amounts, and outcomes. Stays client-side until you authorize vault storage.',
                color: 'text-violet-400',
                border: 'border-violet-500/20',
              },
              {
                step: '02',
                title: 'Engine Builds Behavioral Model',
                desc: 'Vaultis extracts decision patterns: risk posture under inflation, concentration vs. diversification instinct, generational wealth transfer timing, response to black swan events.',
                color: 'text-amber-400',
                border: 'border-amber-500/20',
              },
              {
                step: '03',
                title: 'Compare & Measure Delta',
                desc: 'Input your own decisions. The engine overlays them against the family model and historical macroeconomic backdrops, scoring divergence and projecting outcome trajectories.',
                color: 'text-emerald-400',
                border: 'border-emerald-500/20',
              },
            ].map((s) => (
              <div key={s.step} className={`p-6 rounded-2xl bg-white/[0.03] border ${s.border}`}>
                <div className={`text-4xl font-bold ${s.color} opacity-30 mb-3`}>{s.step}</div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Engine Capabilities</h2>
            <p className="text-white/30 max-w-xl mx-auto text-sm">Built for families who have kept meticulous records. The more history you provide, the sharper the model.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/20 hover:bg-white/[0.05] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                  <f.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Format Preview */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Family Archive Format</h2>
            <p className="text-white/30 max-w-xl mx-auto text-sm">A structured, human-readable format your family archivist or attorney can populate. Supports encrypted export from most institutional record systems.</p>
          </div>
          <div className="rounded-2xl bg-[#0a0f1e] border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="ml-3 text-xs text-white/20 font-mono">family_archive.json</span>
              <Badge className="ml-auto bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs">Encrypted at rest</Badge>
            </div>
            <pre className="p-5 text-xs font-mono text-white/60 overflow-x-auto leading-relaxed">
{`{
  "family": "Wellington",
  "archive_version": "1.0",
  "members": [
    {
      "id": "gen3_charles",
      "name": "Charles H. Wellington III",
      "birth_year": 1941,
      "role": "patriarch",
      "decisions": [
        {
          "date": "1973-10-15",
          "context": "OPEC oil embargo — portfolio stress event",
          "action": "concentrated_real_assets",
          "allocation_shift": { "equities": -0.30, "real_estate": +0.20, "commodities": +0.10 },
          "outcome_10yr_alpha": 0.142,
          "behavioral_tag": ["crisis_concentrate", "inflation_hedge"]
        },
        {
          "date": "1987-10-19",
          "context": "Black Monday — 22% single-day market drop",
          "action": "held_and_accumulated",
          "allocation_shift": { "equities": +0.15 },
          "outcome_10yr_alpha": 0.318,
          "behavioral_tag": ["contrarian", "long_horizon"]
        }
      ]
    }
  ],
  "encryption": "AES-256-GCM",
  "access_policy": "dynasty_vault_only"
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Access Note */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-900/30 to-purple-950/30 border border-violet-500/20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
              <Shield className="w-3 h-3" /> Dynasty Tier Access Only
            </div>
            <h2 className="text-2xl font-bold mb-3">Early Access Registration</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xl mx-auto">
              The Ancestry Decision Engine is available to Dynasty tier members in Q3 2026. 
              Sovereign tier members may request early access by contacting your dedicated advisor.
              All family archive files are processed under attorney-client privilege where applicable.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-white/20 mb-6">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>This feature does not provide investment advice. Decision analysis is historical and informational only.</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard">
                <Button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 gap-2">
                  Go to Dashboard <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" className="border-white/10 text-white/50 hover:text-white hover:bg-white/5">
                Contact Your Advisor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {demoOpen && <AncestryDemo onClose={() => setDemoOpen(false)} />}
    </div>
  );
}