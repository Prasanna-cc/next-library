import "dotenv/config";
import { configDotenv } from "dotenv";

configDotenv();

interface AppEnv {
  DATABASE_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  CALENDLY_TOKEN: string;
  CALENDLY_URI: string;
  CALENDLEY_ORGANIZATION_URI: string;
  POSTGRES_URL: string;
  POSTGRES_PRISMA_URL: string;
  POSTGRES_URL_NO_SSL: string;
  POSTGRES_URL_NON_POOLING: string;
  POSTGRES_USER: string;
  POSTGRES_HOST: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DATABASE: string;
}

// Access and validate environment variables
const getAppEnvs = (): AppEnv => {
  if (
    !(
      process.env.DATABASE_URL &&
      process.env.ACCESS_TOKEN_SECRET &&
      process.env.REFRESH_TOKEN_SECRET &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REDIRECT_URI &&
      process.env.CALENDLY_TOKEN &&
      process.env.CALENDLY_URI &&
      process.env.CALENDLEY_ORGANIZATION_URI &&
      process.env.POSTGRES_URL &&
      process.env.POSTGRES_PRISMA_URL &&
      process.env.POSTGRES_URL_NO_SSL &&
      process.env.POSTGRES_URL_NON_POOLING &&
      process.env.POSTGRES_USER &&
      process.env.POSTGRES_HOST &&
      process.env.POSTGRES_PASSWORD &&
      process.env.POSTGRES_DATABASE
    )
  ) {
    throw new Error("Required environment variables are not defined");
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    CALENDLY_TOKEN: process.env.CALENDLY_TOKEN,
    CALENDLY_URI: process.env.CALENDLY_URI,
    CALENDLEY_ORGANIZATION_URI: process.env.CALENDLEY_ORGANIZATION_URI,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  };
};

export const AppEnvs = getAppEnvs();
