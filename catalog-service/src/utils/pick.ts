import _ from 'lodash';
import { Types } from 'mongoose';
import { ErrorResponse } from 'response';

export const convertToObjectId = (id?: string | null): Types.ObjectId => {
    if (!id || !Types.ObjectId.isValid(id)) {
        throw ErrorResponse.NOTFOUND('Not found ID');
    }
    return new Types.ObjectId(id);
};

export const getInfoData = ({ fields = [] as string[], object = {} }) => {
    return _.pick(object, fields);
};

export const getSelectData = (select: string[] = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};
