import { EXPIRATION_IN_MS } from "../../config.mjs";

export const isExpirationValid = (lastUpdate) => {
  const now = new Date().getTime();
  const lastUpdateTime = new Date(lastUpdate).getTime();
  return now - lastUpdateTime < EXPIRATION_IN_MS;
};
