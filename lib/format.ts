export function formatPriceRub(
  value: number,
  isFrom = false,
  fromLabel = "от"
): string {
  const withSpaces = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${isFrom ? `${fromLabel} ` : ""}${withSpaces} ₽`;
}
