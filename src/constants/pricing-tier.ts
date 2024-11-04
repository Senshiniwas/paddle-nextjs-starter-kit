export interface Tier {
  name: string;
  id: 'starter' | 'pro' | 'advanced';
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: Record<string, string>;
}

export const PricingTier: Tier[] = [
  {
    name: 'Starter',
    id: 'starter',
    icon: '/assets/icons/price-tiers/free-icon.svg',
    description: 'Ideal for individuals who want to get started with simple design tasks.',
    features: ['1 workspace', 'Limited collaboration', 'Export to PNG and SVG'],
    featured: false,
    priceId: { month: 'pri_01jbr8j67ezjv7t9b6ed4697qv', year: 'pri_01jbr8k7d850w7qw6p3yk79htg' },
  },
  // {
  //   name: 'Pro',
  //   id: 'pro',
  //   icon: '/assets/icons/price-tiers/basic-icon.svg',
  //   description: 'Enhanced design tools for scaling teams who need more flexibility.',
  //   features: ['Integrations', 'Unlimited workspaces', 'Advanced editing tools', 'Everything in Starter'],
  //   featured: true,
  //   priceId: { month: 'pro_01jbr79trbtfdw71ee7ewfdp5s', year: 'pro_01jbr79trbtfdw71ee7ewfdp5s' },
  // },
  // {
  //   name: 'Advanced',
  //   id: 'advanced',
  //   icon: '/assets/icons/price-tiers/pro-icon.svg',
  //   description: 'Powerful tools designed for extensive collaboration and customization.',
  //   features: [
  //     'Single sign on (SSO)',
  //     'Advanced version control',
  //     'Assets library',
  //     'Guest accounts',
  //     'Everything in Pro',
  //   ],
  //   featured: false,
  //   priceId: { month: 'pri_01hsxyff091kyc9rjzx7zm6yqh', year: 'pri_01hsxyfysbzf90tkh2wqbfxwa5' },
  // },
];
