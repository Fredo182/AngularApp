import { IDataBaseObj } from './_base';
import { TableMap } from '../table-map';

export interface ISeller extends IDataBaseObj {
    name?: string;
    location?: string;
    dateCreated?: Date;
}

export class Seller implements ISeller {
    static tableName: string = TableMap.Sellers;

    id: string;

    name?: string;
    location?: string;
    dateCreated?: Date;

    constructor(props: ISeller) {
        Object.keys(props).forEach(prop => {
            const value = props[prop];
            this[prop] = value;
        });
    }
}