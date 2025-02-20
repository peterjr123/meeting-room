import { Dayjs } from "dayjs";
import { DateString, TimeString } from "./data/type";

// time1이 빠르면 -1, 같으면 0, 늦으면 1
export function compareTime(time1: TimeString, time2: TimeString) {
  const minutes1 = toMinutes(time1);
  const minutes2 = toMinutes(time2);

  if (minutes1 < minutes2) return -1; // time1이 더 이른 시간
  if (minutes1 > minutes2) return 1;  // time1이 더 늦은 시간
  return 0; // 두 시간이 같음
}


// include edge
export function isTimeBetweenIncludeEdge(startTime: string, duration: number, targetTime: string): boolean {
  const startMinutes = toMinutes(startTime);
  const targetMinutes = toMinutes(targetTime);
  const endMinutes = startMinutes + duration;
  return targetMinutes >= startMinutes && targetMinutes < endMinutes;
};
export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes; // 총 분(minute)으로 변환
}

export function converToDuration(startTime: string, endTime: string): number {
  const minutes1 = toMinutes(startTime);
  const minutes2 = toMinutes(endTime);

  return minutes2 - minutes1;
}

export function convertDayjsToDateString(dayjs: Dayjs): DateString {
  return dayjs.format("YYYY-MM-DD") as DateString;
}

export function convertDayjsToTimeString(dayjs: Dayjs): TimeString {
  return dayjs.format("HH:mm") as TimeString;
}

export function roundDownDayjsToNearestTenMinutes(dayjs: Dayjs): TimeString {
  return dayjs.subtract(dayjs.minute() % 10, 'minute').second(0).format('HH:mm') as TimeString;
};

export function getDayInWeek(dayjs: Dayjs) {
  return dayjs.format("dddd");
}

export function endTimeDisplayEncode(endTime: string) {
  const [hour, minute] = endTime.split(":");
  return ((minute) ? `${hour}:${minute[0]}${Number(minute[1]) + 9}` : endTime); // INFO: endTime의 초기 설계가 잘못된 관계로 DB를 수정해기 이전까지는 사용해야함.
}

export function endTimeDisplayDecode(endTime: string) {
  const [hour, minute] = endTime.split(":");
  return ((minute) ? `${hour}:${minute[0]}${Number(minute[1]) - 9}` : endTime); // INFO: endTime의 초기 설계가 잘못된 관계로 DB를 수정해기 이전까지는 사용해야함.
}



