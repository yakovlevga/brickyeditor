import { html } from '@/fields/html';
import { embed } from '@/fields/embed';
import { container, ContainerFieldData } from '@/fields/container';
import { image } from '@/fields/image';
import { bre } from '@/types/bre';

export const fieldFactories: Record<
  bre.field.FieldType,
  bre.field.FieldDescriptor | bre.field.FieldDescriptor<ContainerFieldData>
> = {
  html,
  image,
  embed,
  container,
};

export const getFieldFactory = (
  fieldType: bre.field.FieldType
): bre.field.FieldDescriptor => {
  return fieldFactories[fieldType] as bre.field.FieldDescriptor;
  // take base field props from data-bre-field attribute
  // const data = helpers.parseElementData($element, 'breField');
  // if (data === null) {
  //   return null;
  // }

  // const fieldData = {
  //   ...data,
  //   ...initialData,
  // };

  // const createFieldFn = fieldFactories[fieldData.type];
  // if (createFieldFn === undefined) {
  //   throw new Error(`${fieldData.type} field not found`);
  // }

  // return createFieldFn(props);
};
