import { format } from "date-fns";
import { ko } from "date-fns/locale";

export function formatDateKo(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}.`;
}

export function formatDate(testdate) {
  const date = new Date(testdate);

  return format(date, "yyyy년 M월 d일 a h:mm", { locale: ko });
}
