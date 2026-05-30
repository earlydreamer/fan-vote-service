import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'unstyled';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...props
}) => {
  const getClassName = () => {
    if (variant === 'unstyled') {
      return className;
    }
    const baseClass = 'button';
    const variantClass = variant === 'secondary' ? 'button-secondary' : 'button-primary';
    return `${baseClass} ${variantClass} ${className}`.trim();
  };

  return (
    <button type={type} className={getClassName()} {...props}>
      {children}
    </button>
  );
};
