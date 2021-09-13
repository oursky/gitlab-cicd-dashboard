const { DateTime } = require("luxon");

exports.getTimeByTimezone = function getTimeByTimezone(zuluTime, clientTimezone) {
  if (zuluTime == null) {
    return;
  }
  const timezone = "Asia/Hong_Kong"
  if(typeof clientTimezone === 'string'){
    timezone = clientTimezone
  }
  
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
  return convertedTime.toLocaleString(DateTime.DATETIME_MED);
};
