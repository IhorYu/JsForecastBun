import { object, string, number } from "yup";

export const cityObjValidate = object({
  longitude: number().required().min(-180).max(180),
  latitude: number().required().min(-90).max(90),
  name: string().required(),
});
