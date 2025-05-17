export function formatDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase(); // e.g., "JAN"
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}
