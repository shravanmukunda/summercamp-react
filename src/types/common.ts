import { ReactNode } from 'react';

export interface RouteProps {
  children?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ComponentWithClassName {
  className?: string;
}

export interface ButtonProps extends ComponentWithClassName {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends ComponentWithClassName {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends ComponentWithClassName {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}