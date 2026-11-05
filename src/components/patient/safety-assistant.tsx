'use client';

import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ChatMessage {
  sender: 'patient' | 'assistant';
  text: string;
  isEmergency?: boolean;
  isRefusal?: boolean;
}

export const SafetyAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Hello, I am your verified MedPass safety assistant. Ask me questions regarding your prescribed Mounjaro dosage, storage, or power outage rules.',
    },
  ]);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clinicPhone = '+2348012345678';

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLocked) return;

    const newMessages: ChatMessage[] = [...messages, { sender: 'patient', text: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend }),
      });
      const data = await response.json();

      if (data.status === 'EMERGENCY') {
        setIsLocked(true);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.message,
            isEmergency: true,
          },
        ]);
      } else if (data.refuseSpeculation) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.answer,
            isRefusal: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.answer,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Service temporarily unavailable. Please call your clinic duty desk directly.',
          isRefusal: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    { label: 'Power outage (NEPA)', query: 'NEPA took light, will my Mounjaro injection spoil?' },
    { label: 'Take paracetamol?', query: 'Can I take paracetamol with this medicine?' },
    { label: 'Negation test', query: 'I have no chest pain, when should I take my dose?' },
    { label: 'Emergency trigger', query: 'I have severe chest pain and shortness of breath' },
    { label: 'Ungrounded question', query: 'Can I increase my dose to 15mg?' },
  ];

  return (
    <div className="card-surface" style={{ marginTop: '16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="var(--color-primary)" />
          <h3 style={{ font: 'var(--font-title-medium)', color: 'var(--color-on-surface)' }}>
            Grounded Safety Assistant
          </h3>
        </div>
        <span style={{ font: 'var(--font-label-small)', color: 'var(--color-neutral-key-color)' }}>
          Verified Monograph
        </span>
      </div>

      {/* Emergency Lockout Banner */}
      {isLocked && (
        <div
          style={{
            backgroundColor: 'var(--color-error)',
            color: 'var(--color-on-error)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={24} />
            <strong style={{ font: 'var(--font-title-medium)' }}>
              EMERGENCY LOCKDOWN ACTIVATED
            </strong>
          </div>
          <p style={{ font: 'var(--font-body-small)', marginBottom: '12px', lineHeight: '1.5' }}>
            Acute medical red flags detected. Do not wait for chat responses. Stop taking the medicine immediately and call emergency services or your clinic.
          </p>
          <a
            href={`tel:${clinicPhone}`}
            className="btn-primary"
            style={{
              backgroundColor: '#FFFFFF',
              color: 'var(--color-error)',
              fontWeight: 700,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <PhoneCall size={18} />
            <span>Call Clinic Emergency Desk ({clinicPhone})</span>
          </a>
        </div>
      )}

      {/* Chat Messages */}
      <div
        style={{
          maxHeight: '260px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '12px',
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: '8px',
          border: '1px solid var(--color-outline-variant)',
          marginBottom: '12px',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.sender === 'patient' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor:
                msg.sender === 'patient'
                  ? 'var(--color-primary-container)'
                  : msg.isEmergency
                  ? 'var(--color-error-container)'
                  : 'var(--color-surface-container-high)',
              color:
                msg.sender === 'patient'
                  ? 'var(--color-on-primary-container)'
                  : msg.isEmergency
                  ? 'var(--color-on-error-container)'
                  : 'var(--color-on-surface)',
              font: 'var(--font-body-small)',
              lineHeight: '1.5',
            }}
          >
            {msg.text}

            {msg.isRefusal && (
              <div style={{ marginTop: '8px' }}>
                <a
                  href={`tel:${clinicPhone}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--color-primary)',
                    font: 'var(--font-label-small)',
                    fontWeight: 700,
                    textDecoration: 'underline',
                  }}
                >
                  <PhoneCall size={14} />
                  <span>Call Clinic ({clinicPhone})</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Demo Query Chips */}
      {!isLocked && (
        <div style={{ marginBottom: '12px' }}>
          <span
            style={{
              font: 'var(--font-label-small)',
              color: 'var(--color-neutral-key-color)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Test Guardrail Triggers:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {sampleQueries.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSend(item.query)}
                disabled={isLoading}
                style={{
                  font: 'var(--font-label-small)',
                  padding: '4px 8px',
                  backgroundColor: 'var(--color-surface-container)',
                  color: 'var(--color-on-surface)',
                  border: '1px solid var(--color-outline-variant)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{ display: 'flex', gap: '8px' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLocked || isLoading}
          placeholder={isLocked ? 'Input locked for emergency' : 'Ask about your dosage or storage...'}
          style={{
            flex: 1,
            height: '44px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-outline-color)',
            font: 'var(--font-body-small)',
            backgroundColor: isLocked
              ? 'var(--color-surface-container-highest)'
              : 'var(--color-surface-container-lowest)',
            color: 'var(--color-on-surface)',
          }}
        />
        <button
          type="submit"
          disabled={isLocked || isLoading || !input.trim()}
          className="btn-primary"
          style={{ minHeight: '44px', padding: '0 16px' }}
          aria-label="Send Question"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

