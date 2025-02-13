import { Dayjs } from "dayjs";
import { DateString, TimeSlot, TimeString } from "./data/type";

export function compareTime(time1: string, time2: string) {
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

export function converToDuration (startTime: string, endTime: string): number {
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





