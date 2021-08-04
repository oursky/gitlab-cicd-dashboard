const config = {
  origin: `${process.env.APP_ORIGIN}`,
  port: `${process.env.APP_PORT}`,
  AppID: `${process.env.APP_ID}`,
  APP_SECRET: `${process.env.APP_SECRET}`,
  redirect_url: `${process.env.APP_ORIGIN}/redirect`,
  cookieAge: 86400000,
};

module.exports = config;
