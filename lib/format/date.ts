export const MONTH_LABELS_PL = [
  "Sty",
  "Lut",
  "Mar",
  "Kwi",
  "Maj",
  "Cze",
  "Lip",
  "Sie",
  "Wrz",
  "Paź",
  "Lis",
  "Gru",
];

export function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTH_LABELS_PL[month - 1]} ${year}`;
}
