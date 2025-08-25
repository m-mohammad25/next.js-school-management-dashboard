export const formatTime = (dateTime?: string | Date) => {
  if (!dateTime) return "";
  const d = new Date(dateTime);
  return d.toISOString().slice(11, 16); // "HH:mm"
};
export const formatDateTimeLocal = (dateTime?: string | Date) => {
  if (!dateTime) return "";
  const d = new Date(dateTime);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`; // ✅ proper datetime-local format
};
