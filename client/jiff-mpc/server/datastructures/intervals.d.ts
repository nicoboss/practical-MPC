export = intervals;
declare function intervals(start: any, end: any): {
    val: {
        start: any;
        end: any;
    }[];
    is_free(point: any): boolean;
    reserve(point: any): boolean;
    create_free(): any;
};
