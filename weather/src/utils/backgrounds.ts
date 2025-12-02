// src/utils/backgrounds.ts
export function getBackground(condition: string): string {
  const key = condition.toLowerCase();

  if (key.includes("clear")) return "linear-gradient(135deg, #fbd786, #f7797d)";
  if (key.includes("cloud")) return "linear-gradient(135deg, #6a85b6, #bac8e0)";
  if (key.includes("rain")) return "linear-gradient(135deg, #00c6ff, #0072ff)";
  if (key.includes("storm") || key.includes("thunder"))
    return "linear-gradient(135deg, #434343, #000000)";
  if (key.includes("snow")) return "linear-gradient(135deg, #e6dada, #274046)";
  if (key.includes("mist") || key.includes("fog"))
    return "linear-gradient(135deg, #606c88, #3f4c6b)";

  return "linear-gradient(to right, #4facfe, #00f2fe)";
}
