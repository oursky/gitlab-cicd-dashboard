const { DateTime } = require("luxon");

exports.getTimeByTimezone = function getTimeByTimezone(zuluTime, clientTimezone) {
  if (zuluTime == null) {
    return;
  }
  let timezone = "Asia/Hong_Kong"
  if(!clientTimezone.error){
    timezone = clientTimezone
  }

  console.log(timezone)
  
  const timeObj = DateTime.fromISO(zuluTime);
  const convertedTime = DateTime.fromObject(
    {
      year: timeObj.year,
      month: timeObj.month,
      day: timeObj.day,
      hour: timeObj.hour,
      minute: timeObj.minute,
      second: timeObj.second,
    },
    { zone: timezone }
  );
  console.log(convertedTime)
  return convertedTime.toLocaleString(DateTime.DATETIME_MED);
};
