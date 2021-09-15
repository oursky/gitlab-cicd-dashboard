const { DateTime } = require("luxon");

exports.getTimeByTimezone = function getTimeByTimezone(zuluTime, clientTimezone) {
  if (zuluTime == null) {
    return;
  }
  let timezone = "Asia/Hong_Kong"
  if(!clientTimezone.error){
    timezone = clientTimezone.timezone
  }
  
  const timeObj = DateTime.fromISO(zuluTime);
  console.log("API Error: "+clientTimezone.error)
  console.log("Original Time: "+zuluTime)
  console.log("Library converted DateTime obj: "+timeObj)
  console.log("Current Timezone: "+timezone)
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
  console.log("converted Time Obj: "+convertedTime)
  console.log("FINAL RESULT: Timezone: "+ timezone + " Time: " + convertedTime.toLocaleString(DateTime.DATETIME_MED))
  return convertedTime.toLocaleString(DateTime.DATETIME_MED);
};
