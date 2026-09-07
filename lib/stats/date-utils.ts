export function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function startOfUTCDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function addUTCDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + amount);
  return result;
}

export function utcDaysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfUTCDay(b).getTime() - startOfUTCDay(a).getTime()) / msPerDay);
}

export function startOfUTCWeek(date: Date): Date {
  const day = date.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return addUTCDays(startOfUTCDay(date), diffToMonday);
}

export function startOfUTCMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function endOfUTCMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999));
}

export function endOfUTCWeek(date: Date): Date {
  const start = startOfUTCWeek(date);
  const end = addUTCDays(start, 6);
  return new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999));
}

export function goalProgressWindow(now: Date): { start: Date; end: Date } {
  const weekStart = startOfUTCWeek(now);
  const weekEnd = endOfUTCWeek(now);
  const monthStart = startOfUTCMonth(now);
  const monthEnd = endOfUTCMonth(now);
  return {
    start: weekStart < monthStart ? weekStart : monthStart,
    end: weekEnd > monthEnd ? weekEnd : monthEnd,
  };
}
