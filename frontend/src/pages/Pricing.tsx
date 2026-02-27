import { Check, Sparkles, Zap, Building2 } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      description: 'Perfect for individuals getting started',
      gradient: 'from-blue-500 to-blue-600',
      features: [
        '5 queries per day',
        'Basic visualizations',
        'Single data source',
        'Community support',
        '7-day chat history',
        'Export to PDF',
      ],
      limitations: [
        'No team collaboration',
        'Limited AI insights',
      ],
    },
    {
      name: 'Pro',
      icon: Zap,
      description: 'For professionals and growing teams',
      gradient: 'from-teal-500 to-green-500',
      popular: true,
      features: [
        'Unlimited queries',
        'Advanced visualizations',
        'Multiple data sources',
        'Priority support',
        'Unlimited chat history',
        'Export to PDF, Excel, CSV',
        'Custom dashboards',
        'API access',
        'Scheduled reports',
        'Team collaboration (up to 10)',
      ],
      limitations: [],
    },
    {
      name: 'Enterprise',
      icon: Building2,
      description: 'For large organizations with custom needs',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Dedicated account manager',
        '24/7 premium support',
        'Custom integrations',
        'Advanced security features',
        'SSO authentication',
        'Custom AI model training',
        'On-premise deployment option',
        'SLA guarantee',
        'White-label solution',
      ],
      limitations: [],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-mesh transition-colors duration-300 relative overflow-hidden font-gravix">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.1] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-5xl font-black text-[var(--text-primary)] mb-6 tracking-tighter">
            Simple, <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Transparent Pricing</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto font-light leading-relaxed">
            Choose the plan that fits your needs. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`bg-[var(--bg-secondary)] rounded-[2.5rem] shadow-xl border-2 ${plan.popular ? 'border-[#14b8a6] relative' : 'border-[var(--border-color)]'
                  } hover:shadow-2xl transition-all hover:-translate-y-2 group overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <span className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2 tracking-tight">{plan.name}</h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-6 font-medium">{plan.description}</p>

                  <div className="mb-6">
                    <button
                      className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${plan.popular
                          ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white hover:scale-[1.02] shadow-xl shadow-[#14b8a6]/20'
                          : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
                        }`}
                    >
                      Get Started
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">What's included:</p>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center mt-0.5 shadow-sm`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)] font-medium">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start space-x-3 opacity-50">
                        <div className="flex-shrink-0 w-5 h-5 rounded-lg bg-gray-500/20 flex items-center justify-center mt-0.5">
                          <span className="text-xs text-gray-400">×</span>
                        </div>
                        <span className="text-sm text-gray-500 line-through font-medium">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl rounded-[3rem] p-12 shadow-2xl border border-[var(--border-color)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <h2 className="text-3xl font-black text-[var(--text-primary)] mb-12 text-center tracking-tight uppercase">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div>
              <h3 className="font-black text-[var(--text-primary)] mb-2 uppercase text-xs tracking-widest">Can I switch plans anytime?</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-black text-[var(--text-primary)] mb-2 uppercase text-xs tracking-widest">Is there a free trial for Pro?</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                Yes, we offer a 14-day free trial for the Pro plan with full access to all features.
              </p>
            </div>
            <div>
              <h3 className="font-black text-[var(--text-primary)] mb-2 uppercase text-xs tracking-widest">What payment methods?</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="font-black text-[var(--text-primary)] mb-2 uppercase text-xs tracking-widest">Can I cancel?</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                Yes, you can cancel anytime. You'll retain access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
