'use client'

import { useState } from 'react'
import { Check, Star, Zap, Crown, Rocket } from 'lucide-react'

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals getting started',
    price: { monthly: 0, yearly: 0 },
    icon: Star,
    color: 'blue',
    popular: false,
    features: [
      'Process up to 100 emails/month',
      'Basic AI summaries',
      'Email dashboard',
      'Community support',
      'Standard security'
    ],
    limitations: [
      'Limited chat queries (10/month)',
      'Basic analytics',
      'No priority support'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Ideal for busy professionals',
    price: { monthly: 19, yearly: 190 },
    icon: Zap,
    color: 'darkBlue',
    popular: true,
    features: [
      'Process up to 5,000 emails/month',
      'Advanced AI summaries with context',
      'Unlimited chat queries',
      'Advanced analytics & insights',
      'Priority email support',
      'Custom filters & rules',
      'Export & backup options',
      'Mobile app access'
    ],
    limitations: []
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and organizations',
    price: { monthly: 99, yearly: 990 },
    icon: Crown,
    color: 'lightBlue',
    popular: false,
    features: [
      'Unlimited email processing',
      'Advanced AI with custom models',
      'Team collaboration features',
      'Advanced security & compliance',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee (99.9% uptime)',
      'On-premise deployment option',
      'Advanced API access',
      'Custom branding'
    ],
    limitations: []
  }
]

const addOns = [
  {
    name: 'Extra Storage',
    description: 'Additional 10GB email storage',
    price: 5,
    icon: '💾'
  },
  {
    name: 'Advanced Analytics',
    description: 'Detailed reporting and insights',
    price: 15,
    icon: '📊'
  },
  {
    name: 'Priority Support',
    description: '24/7 dedicated support channel',
    price: 25,
    icon: '🚀'
  }
]

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const getColorClasses = (color: string, variant: 'border' | 'text' | 'bg' | 'button') => {
    const colors = {
      blue: {
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        bg: 'bg-blue-500/10',
        button: 'bg-blue-500 hover:bg-blue-600'
      },
      darkBlue: {
        border: 'border-blue-700/30',
        text: 'text-blue-300',
        bg: 'bg-blue-700/10',
        button: 'bg-blue-700 hover:bg-blue-800'
      },
      lightBlue: {
        border: 'border-blue-400/30',
        text: 'text-blue-200',
        bg: 'bg-blue-400/10',
        button: 'bg-blue-400 hover:bg-blue-500'
      }
    }
    return colors[color as keyof typeof colors]?.[variant] || colors.blue[variant]
  }

  const calculateSavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0
    const yearlyCost = monthly * 12
    const savings = yearlyCost - yearly
    return Math.round((savings / yearlyCost) * 100)
  }

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-700/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-6 neon-text">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Start free and upgrade as you grow. All plans include our core AI features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center glass rounded-xl p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon
            const price = plan.price[billingCycle]
            const savings = calculateSavings(plan.price.monthly, plan.price.yearly)

            return (
              <div
                key={plan.id}
                className={`relative glass rounded-3xl p-8 hover-glow transition-all duration-500 ${
                  plan.popular ? 'scale-105 border-purple-500/50' : ''
                } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="gradient-animation text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${getColorClasses(plan.color, 'bg')} mb-4 float-animation`}>
                    <IconComponent className={`w-8 h-8 ${getColorClasses(plan.color, 'text')}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-white">${price}</span>
                      <span className="text-gray-400 ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && plan.price.monthly > 0 && savings > 0 && (
                      <div className="text-green-400 text-sm mt-2">
                        Save {savings}% with yearly billing
                      </div>
                    )}
                  </div>

                  <button
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${getColorClasses(plan.color, 'button')} hover:scale-105 hover:shadow-lg`}
                  >
                    {plan.price.monthly === 0 ? 'Get Started Free' : 'Start Free Trial'}
                  </button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Includes:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-gray-700">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Limitations:</h5>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="text-gray-500 text-sm">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add-ons Section */}
        <div className="glass rounded-3xl p-8 mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Optional Add-ons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="dark-glass rounded-xl p-6 text-center hover-glow">
                <div className="text-3xl mb-4">{addon.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{addon.name}</h4>
                <p className="text-gray-400 text-sm mb-4">{addon.description}</p>
                <div className="text-2xl font-bold text-blue-400">${addon.price}/month</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="dark-glass rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3">Can I change plans anytime?</h4>
              <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="dark-glass rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3">Is there a free trial?</h4>
              <p className="text-gray-400">All paid plans come with a 14-day free trial. No credit card required to start.</p>
            </div>
            <div className="dark-glass rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3">What about data security?</h4>
              <p className="text-gray-400">We use enterprise-grade encryption and never store your email content permanently.</p>
            </div>
            <div className="dark-glass rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3">Do you offer refunds?</h4>
              <p className="text-gray-400">Yes, we offer a 30-day money-back guarantee on all paid plans.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 fade-in-up">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <Rocket className="w-12 h-12 text-blue-400 mx-auto mb-4 float-animation" />
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Email?</h3>
            <p className="text-gray-400 mb-6">
              Join thousands of professionals who have revolutionized their email workflow with InboxPrism.
            </p>
            <button className="btn-primary">
              Start Your Free Trial Today
            </button>
            <p className="text-gray-500 text-sm mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
