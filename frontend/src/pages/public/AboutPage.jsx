import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-4 border-b border-surface-border pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-50 border border-navy-100 rounded-md text-xs font-semibold text-navy-800 tracking-wide uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>About Roomora</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-800 tracking-tight">
          Find Your Room, Feel at Home.
        </h1>
        <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
          Roomora is a dedicated student room discovery and booking-request platform created to simplify student living. We connect university students directly with verified property owners through transparent listings, straightforward applications, and mutual privacy protection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-surface-border rounded-lg p-6 shadow-card space-y-3">
          <h2 className="text-lg font-bold text-navy-800">The Student Challenge</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Finding affordable, safe student accommodation near university campuses is traditionally stressful. Students often encounter opaque pricing, high brokerage commissions, misleading availability, and unwanted public disclosure of private contact numbers.
          </p>
        </div>

        <div className="bg-white border border-surface-border rounded-lg p-6 shadow-card space-y-3">
          <h2 className="text-lg font-bold text-navy-800">The Roomora Solution</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Roomora eliminates the broker middleman. Room owners list accommodations directly with verified monthly rents, occupancy capacities, and expected vacancy dates. Contact numbers remain protected until both parties agree on a booking request.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-navy-800">Our Core Principles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-white border border-surface-border rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-navy-800">Direct Owner Listings</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                No middleman brokers or hidden platform commission fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white border border-surface-border rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-navy-800">Protected Mutual Contact</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Phone numbers and email addresses are disclosed only upon accepted booking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white border border-surface-border rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-navy-800">Transparent Availability</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Real-time Available and Occupied statuses backed directly by live database records.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white border border-surface-border rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-navy-800">Respect for Privacy</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Full compliance with data privacy standards and authenticated role separation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-navy-800 text-white rounded-xl p-8 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold">Ready to find your student room?</h3>
          <p className="text-xs sm:text-sm text-navy-200 mt-1">
            Browse rooms by campus area or register your property today.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/rooms">
            <Button variant="primary" size="md" icon={ArrowRight}>
              Discover Rooms
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
