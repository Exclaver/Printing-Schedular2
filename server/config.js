const baseDir = __dirname;

const Config = {
  PORT: 5000,
  BACKEND_DOMAIN: "https://printing-schedular2.vercel.app",
  BASE_DIR: baseDir,
  FILE_LINK_EXPIRY_IN_MINUTES: 1, // i am setting 1 minute expiry time to check this functionality working or not
  CRYPTR_TOKEN: "fddffd",
  ADMIN_USER: "admin",
  ADMIN_PASS: "pass",
  BLOB_URL:"vercel_blob_rw_tjHbzBFP5yyLekZ7_CFOoUY467sugVR83ZyzZQuwceeuBQL"
};

module.exports = {
  Config,
};
