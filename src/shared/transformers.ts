import { Transform } from 'class-transformer';
import { isNumberString } from 'class-validator';

export function TransformNumberString() {
  return Transform(({ value }) =>
    isNumberString(value) ? Number(value) : value,
  );
}
