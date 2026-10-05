import { BaseServices } from "@/modules/_shared";
import Model from "../models";

export const {
  existsById,
  exists,
  fetchAll,
  fetchOne,
  fetchById,
  createOne,
  updateById,
  updateOne,
  disableById,
  deleteById,
  countDocuments,
} = BaseServices(Model);
