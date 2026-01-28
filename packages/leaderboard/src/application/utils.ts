import { ColumnType } from "../domain/types";
import { FIXED_COLUMNS_DEFAULTS } from "../domain/initial-config";

export const FIXED_COLUMN_TYPES = Object.keys(
  FIXED_COLUMNS_DEFAULTS
) as ColumnType[];

export const isFixedColumnType = (type: ColumnType): boolean =>
  FIXED_COLUMN_TYPES.includes(type);
