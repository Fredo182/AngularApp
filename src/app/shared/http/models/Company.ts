import { IDataBaseObj } from './_base';
import { TableMap } from '../table-map';

export interface ICompany extends IDataBaseObj {
    name?: string;
    location?: string;
    dateCreated?: Date;
}

export class Company implements ICompany {
    static tableName: string = TableMap.Companies;

    id: string;

    name?: string;
    location?: string;
    dateCreated?: Date;

    constructor(props: ICompany) {
        Object.keys(props).forEach(prop => {
            const value = props[prop];
            this[prop] = value;
        });
    }
}