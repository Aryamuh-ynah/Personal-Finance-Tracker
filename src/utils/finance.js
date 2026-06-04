export const fmt = (n) => "৳" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });
export const stripEmoji = (str = "") => str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/gu, " ").trim();
export const catMeta = (name, list) => list.find((c) => c.name === name) || list.find((c) => c.name === stripEmoji(name)) || list[list.length - 1];
export const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

export const isValidDateFormat = (date) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

export const normalizeDate = (date) => {
  if (!date) return today();

  const cleanDate = String(date).trim();

  if (isValidDateFormat(cleanDate)) {
    return cleanDate;
  }

  const parsedDate = new Date(cleanDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return today();
  }

  const offset = parsedDate.getTimezoneOffset();
  const localDate = new Date(parsedDate.getTime() - offset * 60 * 1000);

  return localDate.toISOString().split("T")[0];
};
export const monthKey = (d) => d.slice(0, 7);
