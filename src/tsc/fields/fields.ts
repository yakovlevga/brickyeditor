import { bre } from '@/types/bre';

export const fieldFactories: Partial<Record<
  bre.field.FieldType,
  | bre.field.FieldDescriptor
  | bre.field.FieldDescriptor<bre.field.container.ContainerFieldData>
>> = {};

export const getFieldFactory = (
  fieldType: bre.field.FieldType
): bre.field.FieldDescriptor =>
  fieldFactories[fieldType] as bre.field.FieldDescriptor;
