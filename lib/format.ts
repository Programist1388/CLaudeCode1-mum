export function formatPriceRub(value: number, isFrom = false): string {
  const withSpaces = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${isFrom ? "от " : ""}${withSpaces} ₽`;
}
