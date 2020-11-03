import { bre } from '@/types/bre';

export const isContainerField = (
  field: bre.field.FieldBase
): field is bre.field.container.ContainerField =>
  field.data.type === 'container';
