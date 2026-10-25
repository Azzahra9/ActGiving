export function formatRupiah(amount: number | string | undefined | null): string {
  const num = typeof amount === 'number' ? (isNaN(amount) ? 0 : amount) : (Number(amount) || 0);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumber(num: number | string | undefined | null): string {
  const val = typeof num === 'number' ? (isNaN(num) ? 0 : num) : (Number(num) || 0);
  return new Intl.NumberFormat('id-ID').format(val);
}
