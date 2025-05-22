export function getTicketTypeStyle(name: string) {
  const hash = hashString(name.toLowerCase());
  const colorIndex = hash % COLORS.length;
  return COLORS[colorIndex];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const COLORS = [
  "bg-blue-800 text-blue-200",
  "bg-purple-800 text-purple-200",
  "bg-green-800 text-green-200",
  "bg-yellow-800 text-yellow-200",
  "bg-pink-800 text-pink-200",
  "bg-red-800 text-red-200",
  "bg-indigo-800 text-indigo-200",
  "bg-teal-800 text-teal-200",
  "bg-gray-800 text-gray-200",
];
