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
    return Object.fromEntries(select.map((el) => [el, 1]));
};
