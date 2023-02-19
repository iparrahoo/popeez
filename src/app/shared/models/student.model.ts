export interface IStudent {
    name?: string;
    male?: boolean;
    present?: boolean;
}

export class Student implements IStudent {
    constructor(
        public name?: string,
        public male?: boolean,
        public present?: boolean,
    ) {}
}
