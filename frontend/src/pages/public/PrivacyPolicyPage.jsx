import React from 'react';
import { Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-surface-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-navy-50 border border-navy-100 rounded text-xs font-semibold text-navy-800 uppercase tracking-wider mb-3">
          <Shield className="w-3.5 h-3.5 text-teal-600" />
          <span>Roomora Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Effective Date: October 2026 &bull; Platform Version 1.0
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-charcoal space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">1. Purpose and Scope</h2>
          <p>
            Roomora is an accommodation discovery system built specifically to help university students and room seekers discover suitable rooms, and to allow property owners to publish listings and review booking requests. This Privacy Policy outlines our procedures regarding the collection, storage, and controlled disclosure of user information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1 text-charcoal-muted">
            <li><strong>Account Data:</strong> Full name, verified email address, contact phone number, account password (stored securely as a salted Argon2id hash), gender, age, profile photo, and selected role (Student or Owner).</li>
            <li><strong>Listing Data:</strong> Property title, detailed description, location, monthly rent amount, maximum occupant capacity, and expected vacancy dates provided by room owners.</li>
            <li><strong>Booking Records:</strong> Room identifiers, student identifiers, timestamped booking request submissions, and status transition logs (pending, accepted, rejected, cancelled).</li>
          </ul>
        </section>

        <section className="space-y-2 bg-surface-bg border border-surface-border rounded-lg p-5">
          <div className="flex items-center gap-2 text-navy-800 font-bold text-sm mb-1">
            <Lock className="w-4 h-4 text-teal-600" />
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
          <h2 className="text-base font-bold text-navy-800">4. Password Security and Storage</h2>
          <p>
            Passwords are never stored in plaintext. Roomora applies the modern Argon2id cryptographic hashing algorithm via Passlib/pwdlib before persisting user records to MongoDB. Database administrators cannot view your raw password.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">5. Session Tokens and Cookies</h2>
          <p>
            We utilize JSON Web Tokens (JWT) using the HS256 algorithm with a standard 30-minute validity period to authenticate API interactions. When your session expires, you will be prompted to re-authenticate securely.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">6. Data Rights and Updates</h2>
          <p>
            Users can view and update their full name, phone number, gender, age, and profile photo at any time via the User Profile page. Room owners can update or delete their room listings, provided there is no active accepted tenant.
          </p>
        </section>
      </div>
    </div>
  );
};
