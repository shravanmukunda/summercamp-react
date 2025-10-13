import React from 'react';
import Button from '../components/ui/Button';

type BillingPeriod = 'monthly' | '6months' | 'yearly';

const Packages = () => {
  const [billingPeriod, setBillingPeriod] = React.useState<BillingPeriod>('monthly');

  // Define pricing based on billing period
  const basicPlanPrices: Record<BillingPeriod, { amount: string; period: string }> = {
    monthly: { amount: '199', period: '/month' },
    '6months': { amount: '149', period: '/month (6 months)' },
    yearly: { amount: '99', period: '/month (yearly)' }
  };

  const proPlanPrices: Record<BillingPeriod, { amount: string; period: string }> = {
    monthly: { amount: '3,999', period: '/month' },
    '6months': { amount: '3,599', period: '/month (6 months)' },
    yearly: { amount: '2,999', period: '/month (yearly)' }
  };

  const getBasicPlanPrice = () => basicPlanPrices[billingPeriod];
  const getProPlanPrice = () => proPlanPrices[billingPeriod];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose the Perfect Plan for Your Academy</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Whether you just want visibility or full marketing support, we've got you covered.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
            onClick={() => setBillingPeriod('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              billingPeriod === '6months'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
            onClick={() => setBillingPeriod('6months')}
          >
            6 Months
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              billingPeriod === 'yearly'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
            onClick={() => setBillingPeriod('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Basic Listing Plan */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2"/>
                <path d="M12 8L12 12L16 16" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12L8 16" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Basic Listing Plan</h3>
          </div>
          
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">₹{getBasicPlanPrice().amount}</span>
            <span className="text-gray-500 ml-1">{getBasicPlanPrice().period}</span>
          </div>
          
          <ul className="space-y-3 mb-6">
            {[
              'Academy Rage on FindMyCoach',
              'Search visibility by sport & city',
              'Contact Form & WhatsApp button',
              'Basic analytics dashboard',
              'Verified badge',
              '1 Instagram story tag per quarter'
            ].map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 7H12V6C12 5.44772 11.5523 5 11 5H9C8.44772 5 8 5.44772 8 6V7H7C6.44772 7 6 7.44772 6 8V11C6 11.5523 6.44772 12 7 12H8V13C8 13.5523 8.44772 14 9 14H11C11.5523 14 12 13.5523 12 13V12H13C13.5523 12 14 11.5523 14 11V8C14 7.44772 13.5523 7 13 7Z" fill="#10B981"/>
                </svg>
                <span className="ml-2 text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button variant="primary" className="w-full">
            Select Plan
          </Button>
        </div>

        {/* Pro Marketing Plan */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2"/>
                <path d="M12 8L12 12L16 16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12L8 16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Pro Marketing Plan</h3>
          </div>
          
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">₹{getProPlanPrice().amount}</span>
            <span className="text-gray-500 ml-1">{getProPlanPrice().period}</span>
          </div>
          
          <ul className="space-y-3 mb-6">
            {[
              'Paid marketing (Instagram, Meta, etc.)',
              'Ad spend management (99%)',
              'Featured listing priority',
              'Monthly report & optimization',
              'Dedicated marketing support'
            ].map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 7H12V6C12 5.44772 11.5523 5 11 5H9C8.44772 5 8 5.44772 8 6V7H7C6.44772 7 6 7.44772 6 8V11C6 11.5523 6.44772 12 7 12H8V13C8 13.5523 8.44772 14 9 14H11C11.5523 14 12 13.5523 12 13V12H13C13.5523 12 14 11.5523 14 11V8C14 7.44772 13.5523 7 13 7Z" fill="#3B82F6"/>
                </svg>
                <span className="ml-2 text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button variant="primary" className="w-full">
            Select Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Packages;