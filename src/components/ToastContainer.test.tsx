import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastContainer } from './ToastContainer';
import { toast } from '../services/toast';

describe('ToastContainer Component', () => {
  beforeEach(() => {
    toast.clear();
  });

  it('renders nothing when no toasts active', () => {
    render(<ToastContainer />);
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('renders active toasts with correct roles and messages', () => {
    render(<ToastContainer />);

    act(() => {
      toast.success('Music Pass acquired!');
      toast.error('Transaction failed');
    });

    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBe(2);
    expect(screen.getByText('Music Pass acquired!')).toBeDefined();
    expect(screen.getByText('Transaction failed')).toBeDefined();
  });

  it('dismisses toast when close button clicked', () => {
    render(<ToastContainer />);

    act(() => {
      toast.info('Dismiss me');
    });

    expect(screen.getByText('Dismiss me')).toBeDefined();

    const closeBtn = screen.getByLabelText('Close notification');
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Dismiss me')).toBeNull();
  });
});
