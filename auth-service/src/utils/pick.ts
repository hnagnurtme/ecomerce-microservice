import _ from 'lodash';
import { Types } from 'mongoose';

export const convertToObjectId = (id: string) => {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${JSON.stringify(id)}`);
  }
  return new Types.ObjectId(id);
};

export const getInfoData = ({ fields = [] as string[], object = {} }) => {
  return _.pick(object, fields);
};

export const getSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map(el => [el, 1]));
};

export const convertToIdString = (id: Types.ObjectId | string) => {
  if (!id) {
    return '';
  }
  if (typeof id === 'string') {
    return id;
  }
  if (id instanceof Types.ObjectId) {
    return id.toString();
  }
  throw new Error(`Invalid ObjectId: ${JSON.stringify(id)}`);
};
