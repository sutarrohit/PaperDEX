export const truncateNumbers = (num: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.trunc(num * factor) / factor;
};
