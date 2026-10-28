import React from 'react';
import { FileText, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-surface-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-navy-50 border border-navy-100 rounded text-xs font-semibold text-navy-800 uppercase tracking-wider mb-3">
          <FileText className="w-3.5 h-3.5 text-teal-600" />
          <span>User Agreement &amp; Rental Policies</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Last Updated: October 2026 &bull; Roomora Platform Terms of Service
        </p>
      </div>

      {/* Critical Non-Refundable Advance Policy Notice */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-5 flex items-start gap-3.5 shadow-subtle">
        <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1.5 leading-relaxed">
          <p className="font-bold text-sm text-amber-950 uppercase tracking-wide">
            Critical Policy: Booking Advance is Strictly Non-Refundable
          </p>
          <p>
            When a property owner accepts a student's booking request and the student transfers a booking advance or deposit directly to the owner to secure the room, <strong>that booking advance is 100% NON-REFUNDABLE</strong> under all circumstances. Please inspect and confirm all details before transferring any advance funds.
          </p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-charcoal space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">1. Acceptance of Terms</h2>
          <p>
            By creating an account, browsing listings, or submitting booking requests on Roomora, you agree to comply with and be bound by these Terms and Conditions. If you disagree with any part of these terms, you should discontinue use of the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">2. Student &amp; Room Seeker Obligations</h2>
          <ul className="list-disc pl-5 space-y-1 text-charcoal-muted">
            <li>Users must provide accurate, current, and complete personal and contact information during registration.</li>
            <li>Booking requests should represent a genuine intent to occupy or visit the listing.</li>
            <li>Students may cancel pending booking requests at any time before the owner accepts them.</li>
            <li>Once a request is accepted, students are expected to coordinate respectfully and directly with the room owner.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">3. Property Owner Obligations</h2>
          <ul className="list-disc pl-5 space-y-1 text-charcoal-muted">
            <li>Owners warrant that property listings are authentic, accurately represented, and that the owner has the legal authority to rent the premises.</li>
            <li>Listing information including monthly rent, location, and maximum occupant capacity must be factual.</li>
            <li>Owners agree to keep room availability updated by toggling room status between Available and Occupied.</li>
            <li>Owners cannot delete a room listing if there is an active accepted booking on that property.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">4. Booking Process and Mutual Contact Disclosure</h2>
          <p>
            Roomora operates strictly as a connection and discovery facilitator. Submitting a booking request does not constitute a tenancy agreement until both parties mutually confirm and finalize terms.
          </p>
          <p>
            Contact information (phone number and email address) is made accessible to both parties only after the property owner explicitly marks the booking request as Accepted in the system.
          </p>
        </section>

        {/* Dedicated Section 5: Non-Refundable Booking Advance Policy */}
        <section className="space-y-3 p-5 bg-surface-bg border border-surface-border rounded-lg">
          <h2 className="text-base font-bold text-navy-800 flex items-center gap-2">
            <span>5. Booking Advance &amp; Non-Refundability Policy</span>
          </h2>
          <p className="font-semibold text-rose-700 text-xs">
            Notice Regarding Booking Advances and Reservation Deposits:
          </p>
          <p>
            Once a booking request has been accepted and the student proceeds to pay a final booking advance, token amount, or deposit directly to the property owner to lock in the room/bed, <strong>this booking advance is STRICTLY NON-REFUNDABLE</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-charcoal-muted">
            <li>
              <strong>Room Reservation Lock:</strong> Paying the advance obligates the property owner to hold the room exclusively for the student and decline all other student applicants. Because the property owner withdraws the room from the active market, the advance payment serves as a non-refundable commitment fee.
            </li>
            <li>
              <strong>No Refunds for Cancellations:</strong> If the student subsequently cancels, changes their mind, decides on alternative housing, or fails to move in on the agreed vacancy date, the property owner is under no obligation to refund the advance amount.
            </li>
            <li>
              <strong>Prior Due Diligence:</strong> Students are strictly advised to verify all room specifications, physical conditions, location suitability, rent schedule, and house rules with the property owner prior to transferring any advance payment.
            </li>
            <li>
              <strong>Dispute Limitation:</strong> Because Roomora does not process or intermediate direct monetary transactions, the platform is not liable for advance deposit disputes between students and property owners.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">6. Platform Disclaimers and Limitations</h2>
          <p>
            Roomora does not handle physical security deposits or on-platform rent payments. All monetary transactions, lease agreements, and physical inspections occur directly between students and property owners. Roomora shall not be liable for disagreements arising outside platform functionality.
          </p>
        </section>
      </div>
    </div>
  );
};
