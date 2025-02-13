import { Dayjs } from "dayjs";

function compareTime(time1: string, time2: string) {
    const minutes1 = toMinutes(time1);
    const minutes2 = toMinutes(time2);
  
    if (minutes1 < minutes2) return -1; // time1이 더 이른 시간
    if (minutes1 > minutes2) return 1;  // time1이 더 늦은 시간
    return 0; // 두 시간이 같음
  }


// include edge
function isTimeBetweenIncludeEdge(startTime: string, duration: number, targetTime: string): boolean {
    console.log(startTime, duration, targetTime)
    const startMinutes = toMinutes(startTime);
    const targetMinutes = toMinutes(targetTime);
    const endMinutes = startMinutes + duration;
    console.log(startMinutes, targetMinutes, endMinutes)
    return targetMinutes >= startMinutes && targetMinutes < endMinutes;
  };
function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes; // 총 분(minute)으로 변환
}

function converToDuration (startTime: string, endTime: string): number {
  const minutes1 = toMinutes(startTime);
  const minutes2 = toMinutes(endTime);

  return minutes2 - minutes1;
}

function convertDayjsToString(dayjs: Dayjs): string {
  return dayjs.format("YYYY-MM-DD");
}

export {compareTime, toMinutes, isTimeBetweenIncludeEdge, converToDuration, convertDayjsToString}


