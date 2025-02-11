function compareTime(time1: string, time2: string) {
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
  
    const minutes1 = toMinutes(time1);
    const minutes2 = toMinutes(time2);
  
    if (minutes1 < minutes2) return -1; // time1이 더 이른 시간
    if (minutes1 > minutes2) return 1;  // time1이 더 늦은 시간
    return 0; // 두 시간이 같음
  }

export {compareTime}