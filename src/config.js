const config = {
  origin: `${process.env.APP_ORIGIN}`,
  AppID: `${process.env.APP_ID}`,
  APP_SECRET: `${process.env.APP_SECRET}`,
  redirect_url: `${process.env.APP_ORIGIN}/redirect`,
  cookieAge: `${process.env.COOKIE_AGE}`,
  DB_URL: `${process.env.DB_URL}`,
  CACHE_TIMEOUT: `${process.env.CACHE_TIMEOUT}`
};

module.exports = config;
