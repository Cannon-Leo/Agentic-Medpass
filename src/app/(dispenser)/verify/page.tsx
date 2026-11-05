'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, QrCode, UserCheck } from 'lucide-react';
import { dispensePrescription } from '@/actions/dispense';

export default function DispenserVerifyPage() {
  const [pickupCode, setPickupCode] = useState('MED742');
  const [birthYearInput, setBirthYearInput] = useState('');
  const [verificationState, setVerificationState] = useState<'idle' | 'verified' | 'dispensed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingRefills, setRemainingRefills] = useState(2);
  const [totalRefills] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const correctBirthYear = 1982;

  const handleVerifyPass = () => {
    setErrorMessage('');
    if (!pickupCode.trim()) {
      setErrorMessage('Please enter a 6-character pickup code.');
      return;
    }
    if (pickupCode.trim().toUpperCase() !== 'MED742') {
      setErrorMessage('Prescription code not found. For this demo, use: MED742');
      return;
    }
    if (!birthYearInput) {
      setErrorMessage('Ask customer for verbal birth year confirmation.');
      return;
    }
    if (parseInt(birthYearInput, 10) !== correctBirthYear) {
      setErrorMessage('Birth year challenge failed. Oral confirmation does not match patient record (1982).');
      return;
    }

    setVerificationState('verified');
  };

  const handleConfirmDispense = async () => {
    setIsLoading(true);
    await dispensePrescription('mock-prescription-uuid', 'mock-dispenser-uuid', parseInt(birthYearInput, 10));

    setRemainingRefills((prev) => Math.max(0, prev - 1));
    setVerificationState('dispensed');
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px 48px 16px' }}>
      {/* Navigation */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          href="/"
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
          <span>Home</span>
        </Link>
      </div>

      <header style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              font: 'var(--font-label-small)',
              color: 'var(--color-primary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Dispensary Partner Terminal
          </span>
          <span className="badge-ready">Online Terminal</span>
        </div>
        <h1 style={{ font: 'var(--font-headline-medium)', color: 'var(--color-on-background)', marginTop: '4px' }}>
          Counter Verification & Dispense
        </h1>
        <p style={{ font: 'var(--font-body-medium)', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
          Broadway Chemist, Ikeja &bull; WhatsApp Magic Link Authenticated Session
        </p>
      </header>

      {/* Verification Challenge Card */}
      {verificationState === 'idle' && (
        <section className="card-surface">
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="pickup-code-input"
              style={{ display: 'block', font: 'var(--font-title-small)', marginBottom: '8px' }}
            >
              1. Enter 6-Character Pickup Code
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="pickup-code-input"
                type="text"
                maxLength={6}
                value={pickupCode}
                onChange={(e) => setPickupCode(e.target.value.toUpperCase())}
                placeholder="MED742"
                style={{
                  flex: 1,
                  height: '48px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-outline-color)',
                  font: 'var(--font-headline-small)',
                  letterSpacing: '4px',
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  color: 'var(--color-on-surface)',
                  textTransform: 'uppercase',
                }}
              />
              <button
                type="button"
                onClick={() => setPickupCode('MED742')}
                className="btn-secondary"
                style={{ gap: '6px' }}
              >
                <QrCode size={18} />
                <span>Simulate Scan</span>
              </button>
            </div>
          </div>

          {/* Verbal Birth Year Challenge */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label htmlFor="birth-year-input" style={{ font: 'var(--font-title-small)', color: 'var(--color-on-surface)' }}>
                2. Verbal Birth Year Challenge
              </label>
              <button
                type="button"
                onClick={() => setBirthYearInput('1982')}
                style={{
                  font: 'var(--font-label-small)',
                  color: 'var(--color-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Fill Correct Year (1982)
              </button>
            </div>
            <p style={{ font: 'var(--font-body-small)', color: 'var(--color-on-surface-variant)', marginBottom: '8px' }}>
              Ask the customer presenting the phone: &quot;What year were you born?&quot;
            </p>
            <input
              id="birth-year-input"
              type="number"
              value={birthYearInput}
              onChange={(e) => setBirthYearInput(e.target.value)}
              placeholder="e.g. 1982"
              style={{
                width: '100%',
                height: '48px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-outline-color)',
                font: 'var(--font-body-large)',
                backgroundColor: 'var(--color-surface-container-lowest)',
                color: 'var(--color-on-surface)',
              }}
            />
          </div>

          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: 'var(--color-error-container)',
                color: 'var(--color-on-error-container)',
                borderRadius: '6px',
                marginBottom: '16px',
                font: 'var(--font-body-small)',
              }}
            >
              <AlertTriangle size={18} color="var(--color-error)" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleVerifyPass}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <UserCheck size={18} />
            <span>Verify Prescription & Challenge</span>
          </button>
        </section>
      )}

      {/* Verified Display Stage */}
      {verificationState === 'verified' && (
        <section className="card-surface" style={{ border: '2px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={24} color="var(--color-primary)" />
              <h2 style={{ font: 'var(--font-title-large)', color: 'var(--color-on-surface)' }}>
                Identity & Prescription Verified
              </h2>
            </div>
            <span className="badge-ready">Authorized</span>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-surface-container)',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              font: 'var(--font-body-small)',
            }}
          >
            <div><strong>Patient Name:</strong> Amina Bello (Confirmed Year: 1982)</div>
            <div><strong>Prescribed Drug:</strong> Mounjaro (Tirzepatide) 5mg Injection Pen</div>
            <div><strong>Verified Dosage:</strong> 1 dose once weekly every Friday morning</div>
            <div><strong>Authorized Refills Remaining:</strong> {remainingRefills} of {totalRefills} boxes</div>
            <div><strong>Issuing Doctor:</strong> Dr. Bello (Reg #MDCN-28491)</div>
          </div>

          <button
            type="button"
            onClick={handleConfirmDispense}
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>{isLoading ? 'Recording Atomic Transaction...' : 'Confirm Counter Dispense'}</span>
          </button>
        </section>
      )}

      {/* Dispensed Success Stage */}
      {verificationState === 'dispensed' && (
        <section className="card-surface" style={{ border: '2px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle2 size={24} color="var(--color-primary)" />
            <h2 style={{ font: 'var(--font-title-large)', color: 'var(--color-on-surface)' }}>
              Medication Dispense Confirmed!
            </h2>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-surface-container)',
              borderRadius: '8px',
              marginBottom: '20px',
              lineHeight: '1.6',
            }}
          >
            <p style={{ font: 'var(--font-body-medium)', color: 'var(--color-on-surface)' }}>
              Atomic transaction committed. Single-use pickup token invalidated.
            </p>
            <p style={{ font: 'var(--font-body-small)', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
              <strong>Updated Patient Ledger:</strong> {remainingRefills} refill{remainingRefills === 1 ? '' : 's'} remaining out of {totalRefills}.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/pass/sample-token" className="btn-primary">
              <span>Inspect Patient Pass Ledger</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setVerificationState('idle');
                setBirthYearInput('');
              }}
              className="btn-secondary"
            >
              Verify Another Pass
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
