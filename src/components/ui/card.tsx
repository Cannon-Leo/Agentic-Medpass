import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  containerVariant?: 'surface' | 'container';
}

export const Card: React.FC<CardProps> = ({
  children,
  containerVariant = 'surface',
  className = '',
  ...props
}) => {
  const baseClass = containerVariant === 'surface' ? 'card-surface' : 'card-surface-container';
  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

