import React from 'react';
import { Shield, Lock } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-warm-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sage text-forest-800 rounded text-xs font-bold uppercase tracking-wider mb-3 border border-sage-300">
          <Shield className="w-3.5 h-3.5 text-forest-800" />
          <span>Roomora Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Effective Date: October 2026 &bull; Platform Version 1.0
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-charcoal space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal">1. Purpose and Scope</h2>
          <p>
            Roomora is an accommodation discovery system built specifically to help university students discover rooms, and to allow property owners to publish listings and manage booking requests. This Privacy Policy outlines our procedures regarding the collection, storage, and controlled disclosure of user information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1 text-charcoal-muted">
            <li><strong>Account Data:</strong> Full name, verified email address, contact phone number, account password (stored securely as a salted Argon2id hash), gender, age, profile photo, and selected role (Student or Owner).</li>
            <li><strong>Listing Data:</strong> Property title, description, location, monthly rent amount, maximum occupant capacity, and expected vacancy dates provided by room owners.</li>
            <li><strong>Booking Records:</strong> Room identifiers, student identifiers, timestamped booking request submissions, and status transition logs (pending, accepted, rejected, cancelled).</li>
          </ul>
        </section>

        <section className="space-y-2 bg-white border border-warm-border rounded-lg p-5 shadow-subtle">
          <div className="flex items-center gap-2 text-charcoal font-bold text-sm mb-1">
            <Lock className="w-4 h-4 text-forest-800" />
            <span>3. Strict Contact Privacy Gate (Mutual Protection)</span>
          </div>
          <p className="text-xs text-charcoal-muted">
            To prevent unsolicited calls and protect personal privacy:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-charcoal-muted mt-2">
            <li>An owner's direct contact phone number and email are <strong>never</strong> publicly displayed on room cards or search results.</li>
            <li>A student's phone number and email are never shared prior to request approval.</li>
            <li>Direct contact details are disclosed to both parties <strong>strictly after</strong> the room owner accepts the student's booking request in the system.</li>
            <li>If a booking request is rejected or cancelled, contact information remains private.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal">4. Password Security and Storage</h2>
          <p>
            Passwords are never stored in plaintext. Roomora applies cryptographic hashing before persisting user records to MongoDB.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal">5. Session Tokens and Cookies</h2>
          <p>
            We utilize JSON Web Tokens (JWT) using the HS256 algorithm with a standard 30-minute validity period to authenticate API interactions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal">6. Data Rights and Updates</h2>
          <p>
            Users can view and update their full name, phone number, gender, age, and profile photo at any time via the User Profile page. Room owners can update or delete their room listings, provided there is no active accepted tenant.
          </p>
        </section>
      </div>
    </div>
  );
};
