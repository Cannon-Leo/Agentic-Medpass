'use client';

import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QrCanvasProps {
  pickupCode: string;
  passUrl?: string;
}

export const QrCanvas: React.FC<QrCanvasProps> = ({
  pickupCode,
  passUrl = 'https://medpass.ng/pass/sample-token',
}) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-outline-variant)',
        borderRadius: '8px',
        padding: '24px 16px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-soft-shadow)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          padding: '12px',
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          border: '1px solid var(--color-outline-variant)',
          marginBottom: '12px',
        }}
      >
        <QRCodeCanvas
          value={`${passUrl}?code=${pickupCode}`}
          size={180}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="H"
        />
      </div>
      <p
        style={{
          font: 'var(--font-label-small)',
          color: 'var(--color-neutral-key-color)',
          marginBottom: '8px',
        }}
      >
        Turn screen brightness up for scanner
      </p>
      <div
        style={{
          font: 'var(--font-headline-medium)',
          color: 'var(--color-on-surface)',
          letterSpacing: '4px',
          fontWeight: 700,
        }}
      >
        {pickupCode}
      </div>
    </div>
  );
};
