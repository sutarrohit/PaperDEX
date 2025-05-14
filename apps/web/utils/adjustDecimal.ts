export function customFormat(num: number): number {
  const absNum = Math.abs(num);

  if (absNum < 0.00001) return 0;

  const str = absNum.toString();
  const [intPart, decPart = ""] = str.split(".");

  let formatted: number;

  if (absNum >= 0.01) {
    formatted = parseFloat(`${intPart}.${decPart.slice(0, 2)}`);
  } else {
    formatted = parseFloat(`0.${decPart.slice(0, 5)}`);
  }

  return num < 0 ? -formatted : formatted;
}
