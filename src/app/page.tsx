import Link from 'next/link';
import {
  FileText,
  CheckCircle,
  QrCode,
  Store,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 20px',
        maxWidth: '680px',
        margin: '0 auto',
        backgroundColor: 'var(--color-background)',
      }}
    >
      {/* Header Bar */}
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--color-outline-variant)',
        }}
      >
        <div>
          <span
            style={{
              font: 'var(--font-label-small)',
              color: 'var(--color-on-primary-container)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Agentic MedPass MVP
          </span>
          <h1
            style={{
              font: 'var(--font-headline-small)',
              color: 'var(--color-on-background)',
              marginTop: '2px',
            }}
          >
            End-to-End Clinical Demo
          </h1>
        </div>
        <span className="badge-ready" style={{ flexShrink: 0 }}>
          PWA &amp; Offline Ready
        </span>
      </header>

      {/* Hero Overview */}
      <section style={{ margin: '24px 0' }}>
        <div className="card-surface card-inverse" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={20} color="var(--color-inverse-primary)" aria-hidden="true" />
            <h2 style={{ font: 'var(--font-title-large)', color: 'var(--color-inverse-on-surface)' }}>
              Interactive Prescription Workflow
            </h2>
          </div>
          <p
            style={{
              font: 'var(--font-body-large)',
              color: 'var(--color-inverse-on-surface)',
              lineHeight: '1.6',
            }}
          >
            Experience the complete lifecycle of a verified prescription: raw note extraction, visual diff doctor signing, WhatsApp digital pass delivery with the built-in clinical AI safety assistant, and verbal-challenge counter dispensing.
          </p>
        </div>

        {/* 4-Step Interactive Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Step 1 */}
          <Link
            href="/draft"
            className="card-surface card-inverse"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              padding: '16px 20px',
              transition: 'border-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-on-primary-container)',
                }}
              >
                <FileText size={20} aria-hidden="true" />
              </div>
              <div>
                <strong style={{ font: 'var(--font-title-small)', color: 'var(--color-inverse-on-surface)', display: 'block' }}>
                  1. Clinic Staff Intake
                </strong>
                <span style={{ font: 'var(--font-body-small)', color: 'var(--color-inverse-on-surface)' }}>
                  Paste raw consultation note &bull; AI extraction engine (temp 0.0)
                </span>
              </div>
            </div>
            <ArrowRight size={18} color="var(--color-inverse-primary)" aria-hidden="true" />
          </Link>

          {/* Step 2 */}
          <Link
            href="/approve"
            className="card-surface card-inverse"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-on-primary-container)',
                }}
              >
                <CheckCircle size={20} aria-hidden="true" />
              </div>
              <div>
                <strong style={{ font: 'var(--font-title-small)', color: 'var(--color-inverse-on-surface)', display: 'block' }}>
                  2. Doctor Approval & PIN Signing
                </strong>
                <span style={{ font: 'var(--font-body-small)', color: 'var(--color-inverse-on-surface)' }}>
                  Visual text diff &bull; 4-digit PIN authorization (0% gate bypass)
                </span>
              </div>
            </div>
            <ArrowRight size={18} color="var(--color-inverse-primary)" aria-hidden="true" />
          </Link>

          {/* Step 3 */}
          <Link
            href="/pass/sample-token"
            className="card-surface card-inverse"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              padding: '16px 20px',
              border: '2px solid var(--color-primary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-on-primary-container)',
                }}
              >
                <QrCode size={20} aria-hidden="true" />
              </div>
              <div>
                <strong style={{ font: 'var(--font-title-small)', color: 'var(--color-inverse-on-surface)', display: 'block' }}>
                  3. Patient Digital Pass & Safety Agent
                </strong>
                <span style={{ font: 'var(--font-body-small)', color: 'var(--color-inverse-on-surface)' }}>
                  Pure-white QR canvas &bull; Everyday dosage &bull; Grounded safety AI
                </span>
              </div>
            </div>
            <ArrowRight size={18} color="var(--color-inverse-primary)" aria-hidden="true" />
          </Link>

          {/* Step 4 */}
          <Link
            href="/verify"
            className="card-surface card-inverse"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-on-primary-container)',
                }}
              >
                <Store size={20} aria-hidden="true" />
              </div>
              <div>
                <strong style={{ font: 'var(--font-title-small)', color: 'var(--color-inverse-on-surface)', display: 'block' }}>
                  4. Dispensary Counter Verification
                </strong>
                <span style={{ font: 'var(--font-body-small)', color: 'var(--color-inverse-on-surface)' }}>
                  Verbal birth year challenge &bull; Online-only atomic dispense
                </span>
              </div>
            </div>
            <ArrowRight size={18} color="var(--color-inverse-primary)" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Footer System Meta */}
      <footer
        style={{
          borderTop: '1px solid var(--color-outline-variant)',
          paddingTop: '16px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            font: 'var(--font-body-small)',
            color: 'var(--color-on-surface-variant)',
          }}
        >
          Zero Gate Bypass Engine &bull; Sub-150KB PWA Transfer &bull; Version 1.0 (MVP)
        </p>
      </footer>
    </main>
  );
}
