'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { extractPrescriptionFromNotes } from '@/actions/extraction';
import type { ClinicalExtraction } from '@/types/clinical';

export default function StaffDraftPage() {
  const sampleNote = `Rx: Amina Bello, 42 years old, phone: 08012345678.
Prescription: 5mg Mounjaro injection pen, one shot every Friday morning for 3 months (3 boxes total).
Pick up at Broadway Chemist, Ikeja.
Patient advised to keep in fridge; safe at room temp up to 30C for 21 days if power goes out.`;

  const [rawNotes, setRawNotes] = useState(sampleNote);
  const [extractedData, setExtractedData] = useState<ClinicalExtraction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [missingUnits, setMissingUnits] = useState(false);

  const handleExtract = async () => {
    setIsLoading(true);
    setMissingUnits(false);

    // Call extraction action
    const res = await extractPrescriptionFromNotes(rawNotes);
    if (res.success && res.data) {
      setExtractedData(res.data);
    }
    setIsLoading(false);
  };

  const handleSimulateMissingUnit = () => {
    setRawNotes('Rx: Amina Bello, phone: 08012345678. Mounjaro 5 once weekly. Broadway Chemist.');
    setMissingUnits(true);
    setExtractedData({
      patientName: 'Amina Bello',
      phoneNumber: '08012345678',
      patientBirthYear: 1982,
      drugName: 'Mounjaro',
      dose: '5',
      frequency: 'Once weekly',
      durationMonths: 1,
      totalRefills: 0,
      pharmacyName: 'Broadway Chemist',
      storageNotes: 'Refrigerated',
      missingFields: ['doseUnit', 'durationMonths', 'totalRefills'],
    });
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '24px 16px 48px 16px' }}>
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
        <span
          style={{
            font: 'var(--font-label-small)',
            color: 'var(--color-primary)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Clinical Intake Module
        </span>
        <h1 style={{ font: 'var(--font-headline-medium)', color: 'var(--color-on-background)', marginTop: '4px' }}>
          Staff Consultation Intake
        </h1>
        <p style={{ font: 'var(--font-body-medium)', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
          Paste raw consultation notes to extract verified prescription entities via deterministic AI (temperature: 0.0).
        </p>
      </header>

      {/* Input Section */}
      <section className="card-surface" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label htmlFor="raw-notes-input" style={{ font: 'var(--font-title-small)', color: 'var(--color-on-surface)' }}>
            Raw Consultation Shorthand
          </label>
          <button
            type="button"
            onClick={handleSimulateMissingUnit}
            style={{
              font: 'var(--font-label-small)',
              color: 'var(--color-error)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Simulate Missing Field Error
          </button>
        </div>

        <textarea
          id="raw-notes-input"
          value={rawNotes}
          onChange={(e) => setRawNotes(e.target.value)}
          rows={5}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: missingUnits ? '2px solid var(--color-error)' : '1px solid var(--color-outline-color)',
            font: 'var(--font-body-medium)',
            backgroundColor: 'var(--color-surface-container-lowest)',
            color: 'var(--color-on-surface)',
            marginBottom: '16px',
            resize: 'vertical',
            lineHeight: '1.5',
          }}
        />

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleExtract}
            disabled={isLoading || !rawNotes.trim()}
            className="btn-primary"
          >
            <Sparkles size={18} />
            <span>{isLoading ? 'Extracting Entities...' : 'Extract Prescription Details'}</span>
          </button>
          <button
            type="button"
            onClick={() => setRawNotes(sampleNote)}
            className="btn-secondary"
          >
            Reset Sample Note
          </button>
        </div>
      </section>

      {/* Structured Output Section */}
      {extractedData && (
        <section className="card-surface">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} color="var(--color-primary)" />
              <h2 style={{ font: 'var(--font-title-large)', color: 'var(--color-on-surface)' }}>
                Extracted Prescription Fields
              </h2>
            </div>
            <span className="badge-ready">Schema Validated</span>
          </div>

          {/* Missing Field Warning Banner */}
          {extractedData.missingFields && extractedData.missingFields.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--color-error-container)',
                color: 'var(--color-on-error-container)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={20} color="var(--color-error)" />
              <div>
                <strong style={{ font: 'var(--font-label-large)' }}>Clinical Validation Flags:</strong>
                <p style={{ font: 'var(--font-body-small)' }}>
                  Missing critical values detected: {extractedData.missingFields.join(', ')}. Manual verification required.
                </p>
              </div>
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div className="card-surface-container">
              <span style={{ font: 'var(--font-label-small)', color: 'var(--color-neutral-key-color)' }}>Patient</span>
              <p style={{ font: 'var(--font-body-large)', color: 'var(--color-on-surface)', fontWeight: 600 }}>
                {extractedData.patientName} ({extractedData.patientBirthYear})
              </p>
            </div>

            <div className="card-surface-container">
              <span style={{ font: 'var(--font-label-small)', color: 'var(--color-neutral-key-color)' }}>Phone</span>
              <p style={{ font: 'var(--font-body-large)', color: 'var(--color-on-surface)' }}>
                {extractedData.phoneNumber}
              </p>
            </div>

            <div className="card-surface-container">
              <span style={{ font: 'var(--font-label-small)', color: 'var(--color-neutral-key-color)' }}>Medication</span>
              <p style={{ font: 'var(--font-body-large)', color: 'var(--color-primary)', fontWeight: 700 }}>
                {extractedData.drugName} {extractedData.dose}
              </p>
            </div>

            <div className="card-surface-container">
              <span style={{ font: 'var(--font-label-small)', color: 'var(--color-neutral-key-color)' }}>Frequency</span>
              <p style={{ font: 'var(--font-body-large)', color: 'var(--color-on-surface)' }}>
                {extractedData.frequency}
              </p>
            </div>

            <div className="card-surface-container">
              <span style={{ font: 'var(--font-label-small)', color: 'var(--color-neutral-key-color)' }}>Duration & Refills</span>
              <p style={{ font: 'var(--font-body-large)', color: 'var(--color-on-surface)' }}>
                {extractedData.durationMonths} Months ({extractedData.totalRefills} Refills)
              </p>
            </div>

            <div className="card-surface-container">
              <span style={{ font: 'var(--font-label-small)', color: 'var(--color-neutral-key-color)' }}>Pharmacy</span>
              <p style={{ font: 'var(--font-body-large)', color: 'var(--color-on-surface)' }}>
                {extractedData.pharmacyName}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Link href="/approve" className="btn-primary">
              <span>Submit to Doctor Approval</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
