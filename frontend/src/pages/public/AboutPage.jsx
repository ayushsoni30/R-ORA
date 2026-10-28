import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Building, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-4 border-b border-warm-border pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage text-forest-800 rounded-md text-xs font-bold uppercase tracking-wider border border-sage-300">
          <ShieldCheck className="w-4 h-4 text-forest-800" />
          <span>About Roomora</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
          Find a place that feels like yours.
        </h1>
        <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
          Roomora connects students searching for accommodation with room owners who want to list and manage their rooms. Transparent listings, real-time availability, and protected contact exchange.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-warm-border rounded-xl p-6 shadow-subtle space-y-3">
          <h2 className="text-base font-bold text-charcoal">The Student Challenge</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Finding affordable, safe student accommodation near university campuses is traditionally stressful. Students often encounter opaque pricing, high brokerage commissions, misleading availability, and unwanted public disclosure of private contact numbers.
          </p>
        </div>

        <div className="bg-white border border-warm-border rounded-xl p-6 shadow-subtle space-y-3">
          <h2 className="text-base font-bold text-charcoal">The Roomora Solution</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Roomora eliminates the broker middleman. Room owners list accommodations directly with verified monthly rents, occupancy capacities, and expected vacancy dates. Contact numbers remain protected until both parties agree on a booking request.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-charcoal">Our Core Principles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-white border border-warm-border rounded-lg shadow-subtle">
            <CheckCircle2 className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-charcoal">Direct Owner Listings</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                No middleman brokers or hidden platform commission fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white border border-warm-border rounded-lg shadow-subtle">
            <CheckCircle2 className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-charcoal">Protected Mutual Contact</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Phone numbers and email addresses are disclosed only upon accepted booking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white border border-warm-border rounded-lg shadow-subtle">
            <CheckCircle2 className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-charcoal">Transparent Availability</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Real-time Available and Occupied statuses backed directly by live records.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white border border-warm-border rounded-lg shadow-subtle">
            <CheckCircle2 className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-charcoal">Respect for Privacy</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Full compliance with data privacy standards and authenticated role separation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-forest-800 text-white rounded-xl p-8 shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold">Ready to find your student room?</h3>
          <p className="text-xs sm:text-sm text-sage mt-1">
            Browse rooms by campus area or list your property today.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/rooms">
            <Button variant="secondary" size="md" icon={ArrowRight}>
              Discover Rooms
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
