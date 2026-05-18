export const fmt = (n) => "৳" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });
export const stripEmoji = (str = "") => str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/gu, " ").trim();
export const catMeta = (name, list) => list.find((c) => c.name === name) || list.find((c) => c.name === stripEmoji(name)) || list[list.length - 1];
export const today = () => new Date().toISOString().split("T")[0];
export const monthKey = (d) => d.slice(0, 7);
