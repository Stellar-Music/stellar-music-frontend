export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  durationMs: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  public subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const copy = [...this.toasts];
    for (const listener of this.listeners) {
      listener(copy);
    }
  }

  public show(message: string, type: ToastType = 'info', durationMs: number = 4000): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const item: ToastItem = { id, message, type, durationMs };
    this.toasts.push(item);
    this.notify();

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
    }

    return id;
  }

  public success(message: string, durationMs?: number): string {
    return this.show(message, 'success', durationMs);
  }

  public error(message: string, durationMs?: number): string {
    return this.show(message, 'error', durationMs);
  }

  public info(message: string, durationMs?: number): string {
    return this.show(message, 'info', durationMs);
  }

  public warning(message: string, durationMs?: number): string {
    return this.show(message, 'warning', durationMs);
  }

  public dismiss(id: string): void {
    const initialLen = this.toasts.length;
    this.toasts = this.toasts.filter((t) => t.id !== id);
    if (this.toasts.length !== initialLen) {
      this.notify();
    }
  }

  public clear(): void {
    this.toasts = [];
    this.notify();
  }

  public getToasts(): ToastItem[] {
    return [...this.toasts];
  }
}

export const toast = new ToastManager();
