const config = {
  host: `http://localhost:8081`,
  port: 8081,
  AppID: `7c0c8e717c744b103b263ef8b89d17cc429e6cfab0cddb8b3df21b66e21b45c1`,
  APP_SECRET: `${process.env.APP_SECRET}`,
  redirect_url: `http://localhost:8081/redirect`,
  cookieAge: 86400000,
};

module.exports = config;
