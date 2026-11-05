'use client';

import React from 'react';
import Link from 'next/link';
import { QrCanvas } from '@/components/patient/qr-canvas';
import { SafetyAssistant } from '@/components/patient/safety-assistant';
import { ShieldCheck, ArrowLeft, ThermometerSnowflake, Repeat, Clock } from 'lucide-react';

interface PatientPassPageProps {
  params: {
    token: string;
  };
}

export default function PatientPassPage({ params }: PatientPassPageProps) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        maxWidth: '480px',
        margin: '0 auto',
        padding: '20px 16px 40px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: 'var(--color-background)',
      }}
    >
      {/* Top Navigation & Status */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} color="var(--color-primary)" />
          <span className="badge-ready">Verified Pass</span>
        </div>
      </div>

      {/* Feature 1: Counter Pickup Token Display */}
      <section aria-label="Pickup Token">
        <QrCanvas pickupCode="MED-742" passUrl="https://medpass.ng/pass/sample-token" />
      </section>

      {/* Feature 2: Everyday Dosage Instructions */}
      <section className="card-surface" aria-label="Dosage Instructions">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1
              style={{
                font: 'var(--font-title-large)',
                color: 'var(--color-on-surface)',
                marginBottom: '4px',
              }}
            >
              Mounjaro (Tirzepatide)
            </h1>
            <span
              style={{
                font: 'var(--font-label-medium)',
                color: 'var(--color-primary)',
                fontWeight: 700,
              }}
            >
              Dose: 5mg Injection Pen
            </span>
          </div>
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: 'var(--color-surface-container)',
              font: 'var(--font-label-small)',
              color: 'var(--color-on-surface)',
            }}
          >
            Weekly
          </span>
        </div>

        <p
          style={{
            font: 'var(--font-body-large)',
            color: 'var(--color-on-surface)',
            lineHeight: '1.6',
            marginTop: '12px',
          }}
        >
          Inject 1 dose every Friday morning under the skin with or without food. Rotate injection sites between abdomen, thigh, or upper arm.
        </p>

        {/* Feature 3: Storage Limits & Power Outage (NEPA) Guidance */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
            padding: '12px',
            backgroundColor: 'var(--color-surface-container)',
            borderRadius: '6px',
            alignItems: 'flex-start',
          }}
        >
          <ThermometerSnowflake size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ font: 'var(--font-label-medium)', display: 'block', color: 'var(--color-on-surface)' }}>
              Storage & Emergency Power Rule
            </strong>
            <p style={{ font: 'var(--font-body-small)', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              Keep refrigerated (2°C to 8°C). If power fails (e.g. NEPA outage), this medicine stays safe at room temperature up to 30°C for 21 days.
            </p>
          </div>
        </div>
      </section>

      {/* Feature 4: Refill and Balance Tracker */}
      <section className="card-surface-container" aria-label="Refill Tracker">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Repeat size={18} color="var(--color-primary)" />
            <h2 style={{ font: 'var(--font-title-small)', color: 'var(--color-on-surface)' }}>
              Refill Ledger
            </h2>
          </div>
          <span style={{ font: 'var(--font-label-medium)', color: 'var(--color-primary)', fontWeight: 700 }}>
            Box 1 of 3 (2 Refills Left)
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--font-body-small)', color: 'var(--color-on-surface-variant)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} />
            <span>Expires: 3 Months from Issue</span>
          </div>
          <span>Partner Chemist: Broadway Chemist</span>
        </div>
      </section>

      {/* Feature 5: Grounded Safety Assistant Component */}
      <section aria-label="Clinical Safety Assistant">
        <SafetyAssistant />
      </section>
    </div>
  );
}
