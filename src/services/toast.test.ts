import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from './toast';

describe('Toast Notification Service', () => {
  beforeEach(() => {
    toast.clear();
    vi.useFakeTimers();
  });

  it('notifies subscribers upon adding a toast', () => {
    const listener = vi.fn();
    const unsub = toast.subscribe(listener);

    toast.success('Pass purchased successfully!');

    expect(listener).toHaveBeenCalled();
    const lastCall = listener.mock.calls[listener.mock.calls.length - 1][0];
    expect(lastCall.length).toBe(1);
    expect(lastCall[0].message).toBe('Pass purchased successfully!');
    expect(lastCall[0].type).toBe('success');

    unsub();
  });

  it('automatically dismisses toasts after durationMs', () => {
    toast.info('Temporary message', 2000);
    expect(toast.getToasts().length).toBe(1);

    vi.advanceTimersByTime(2050);
    expect(toast.getToasts().length).toBe(0);
  });

  it('supports explicit dismissal by id', () => {
    const id1 = toast.error('Error 1', 10000);
    const id2 = toast.warning('Warning 2', 10000);

    expect(toast.getToasts().length).toBe(2);

    toast.dismiss(id1);
    expect(toast.getToasts().length).toBe(1);
    expect(toast.getToasts()[0].id).toBe(id2);
  });
});
