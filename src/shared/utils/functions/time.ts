type Millis = {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export function convertMs(ms: number): Millis {
  const seconds: number = ~~(ms / 1000);
  const minutes: number = ~~(seconds / 60);
  const hours: number = ~~(minutes / 60);
  const days: number = ~~(hours / 24);

  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60
  }
}

export function formatMs(ms: number): string {
  ms = Math.round(ms / 1000);

  const seconds: number = ms % 60;
  const minutes: number = ~~((ms / 60) % 60);
  const hours: number = ~~((ms / 60 / 60) % 24);
  const days: number = ~~(ms / 60 / 60 / 24);

  return `${days}D ${hours}H ${minutes}m ${seconds}s`;
}