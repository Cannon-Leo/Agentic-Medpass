'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckSquare, KeyRound, CheckCircle, ArrowRight, MessageSquare, Send } from 'lucide-react';
import { approveAndIssuePrescription } from '@/actions/prescriptions';

export default function OwnerApprovalPage() {
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isIssued, setIsIssued] = useState(false);
  const [issuedCode, setIssuedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const rawNote = `Rx: Amina Bello, 42 years old, phone: 08012345678.
Prescription: 5mg Mounjaro injection pen, one shot every Friday morning for 3 months (3 boxes total).
Pick up at Broadway Chemist, Ikeja.
Patient advised to keep in fridge; safe at room temp up to 30C for 21 days if power goes out.`;

  const handleApprove = async () => {
    setPinError('');
    if (!hasAcknowledged) {
      setPinError('You must check the diff acknowledgment before signing.');
      return;
    }
    if (pin !== '1234') {
      setPinError('Invalid Doctor PIN. For this demo, use PIN: 1234');
      return;
    }

    setIsLoading(true);
    const res = await approveAndIssuePrescription('mock-prescription-uuid', 'mock-clinic-uuid', pin);
    if (res.success && res.pickupCode) {
      setIssuedCode(res.pickupCode);
      setIsIssued(true);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px 48px 16px' }}>
      {/* Navigation */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          href="/draft"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-on-surface-variant)',
            textDecoration: 'none',
            font: 'var(--font-label-medium)',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Intake Draft</span>
        </Link>
      </div>

      <header style={{ marginBottom: '24px' }}>
        <span
          style={{
            font: 'var(--font-label-small)',
            color: 'var(--color-primary)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Clinic Owner Governance
        </span>
        <h1 style={{ font: 'var(--font-headline-medium)', color: 'var(--color-on-background)', marginTop: '4px' }}>
          Doctor Review & Diff Authorization
        </h1>
        <p style={{ font: 'var(--font-body-medium)', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
          Compare parsed extraction values directly against the original consultation note. Enforces 0% gate bypass rate.
        </p>
      </header>

      {/* Side-by-Side Diff Comparison */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {/* Left: Raw Clinical Consultation Text */}
        <div className="card-surface">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ font: 'var(--font-title-medium)', color: 'var(--color-on-surface)' }}>
              1. Original Consultation Note
            </h2>
            <span style={{ font: 'var(--font-label-small)', color: 'var(--color-neutral-key-color)' }}>
              Source Text
            </span>
          </div>
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-surface-container)',
              borderRadius: '8px',
              font: 'var(--font-body-medium)',
              lineHeight: '1.7',
              color: 'var(--color-on-surface)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {rawNote}
          </div>
        </div>

        {/* Right: Extracted Structured Clinical Entities */}
        <div className="card-surface">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ font: 'var(--font-title-medium)', color: 'var(--color-on-surface)' }}>
              2. Parsed Clinical Entities
            </h2>
            <span className="badge-ready">AI Diff Match</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', font: 'var(--font-body-small)' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--color-surface-container)', borderRadius: '6px' }}>
              <span style={{ color: 'var(--color-neutral-key-color)' }}>Patient Name & Year:</span>
              <p style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>Amina Bello (Birth Year: 1982)</p>
            </div>

            <div style={{ padding: '8px', backgroundColor: 'var(--color-surface-container)', borderRadius: '6px' }}>
              <span style={{ color: 'var(--color-neutral-key-color)' }}>Verified Medication & Dose:</span>
              <p style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Mounjaro 5mg Injection Pen</p>
            </div>

            <div style={{ padding: '8px', backgroundColor: 'var(--color-surface-container)', borderRadius: '6px' }}>
              <span style={{ color: 'var(--color-neutral-key-color)' }}>Regimen & Frequency:</span>
              <p style={{ color: 'var(--color-on-surface)' }}>1 injection every Friday morning</p>
            </div>

            <div style={{ padding: '8px', backgroundColor: 'var(--color-surface-container)', borderRadius: '6px' }}>
              <span style={{ color: 'var(--color-neutral-key-color)' }}>Approved Duration & Refills:</span>
              <p style={{ color: 'var(--color-on-surface)' }}>3 Months (3 Total Refills Authorized)</p>
            </div>

            <div style={{ padding: '8px', backgroundColor: 'var(--color-surface-container)', borderRadius: '6px' }}>
              <span style={{ color: 'var(--color-neutral-key-color)' }}>Assigned Dispensary:</span>
              <p style={{ color: 'var(--color-on-surface)' }}>Broadway Chemist, Ikeja (Accredited Partner)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signature & Issuance Action Box */}
      {!isIssued ? (
        <section className="card-surface-container" style={{ border: '2px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <KeyRound size={20} color="var(--color-primary)" />
            <h2 style={{ font: 'var(--font-title-medium)', color: 'var(--color-on-surface)' }}>
              Owner Cryptographic PIN Authorization
            </h2>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <input
              type="checkbox"
              checked={hasAcknowledged}
              onChange={(e) => setHasAcknowledged(e.target.checked)}
              style={{ width: '20px', height: '20px', marginTop: '2px', accentColor: 'var(--color-primary)' }}
            />
            <span style={{ font: 'var(--font-body-medium)', color: 'var(--color-on-surface)' }}>
              I have verified the extracted dose, regimen, and drug identity against the raw clinical note. I assume full clinical responsibility for issuing this prescription.
            </span>
          </label>

          {pinError && (
            <p style={{ font: 'var(--font-body-small)', color: 'var(--color-error)', marginBottom: '12px' }}>
              {pinError}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={!hasAcknowledged}
              placeholder="4-digit PIN"
              style={{
                width: '160px',
                height: '48px',
                padding: '8px 12px',
                textAlign: 'center',
                borderRadius: '8px',
                border: '1px solid var(--color-outline-color)',
                font: 'var(--font-headline-small)',
                letterSpacing: '8px',
                backgroundColor: hasAcknowledged
                  ? 'var(--color-surface-container-lowest)'
                  : 'var(--color-surface-container-highest)',
              }}
            />

            <button
              type="button"
              onClick={handleApprove}
              disabled={!hasAcknowledged || pin.length !== 4 || isLoading}
              className="btn-primary"
            >
              <span>{isLoading ? 'Signing & Dispatching...' : 'Approve & Issue Web Pass'}</span>
              <Send size={18} />
            </button>
            <span style={{ font: 'var(--font-label-small)', color: 'var(--color-neutral-key-color)' }}>
              (Demo PIN: 1234)
            </span>
          </div>
        </section>
      ) : (
        /* Issuance & Dispatch Success View */
        <section
          className="card-surface"
          style={{ border: '2px solid var(--color-primary)', backgroundColor: 'var(--color-surface)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle size={24} color="var(--color-primary)" />
            <h2 style={{ font: 'var(--font-title-large)', color: 'var(--color-on-surface)' }}>
              Prescription Successfully Issued!
            </h2>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-surface-container)',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <p style={{ font: 'var(--font-body-large)', color: 'var(--color-on-surface)', marginBottom: '8px' }}>
              <strong>Active Pickup Token:</strong> {issuedCode}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', font: 'var(--font-label-medium)' }}>
              <MessageSquare size={16} />
              <span>WhatsApp Cloud API Pass dispatched to 08012345678 (SMS Termii fallback armed).</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/pass/sample-token" className="btn-primary">
              <span>Open Patient Pass View</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/verify" className="btn-secondary">
              <span>Go to Pharmacy Counter Scan</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
