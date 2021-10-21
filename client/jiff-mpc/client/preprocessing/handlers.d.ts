export function bits_count(threshold: any, receivers_list: any, compute_list: any, Zp: any, op_id: any, params: any): any;
export function constant_bits_count(...args: any[]): number;
export function dynamic_bits_cmult(dependent_op: any, count: any, protocols: any, threshold: any, receivers_list: any, compute_list: any, Zp: any, task_id: any, params: any): {
    op: string;
    op_id: string;
    params: {
        bitLengthLeft: any;
        bitLengthRight: any;
    };
}[];
export function dynamic_bits_smult(dependent_op: any, count: any, protocols: any, threshold: any, receivers_list: any, compute_list: any, Zp: any, task_id: any, params: any): ({
    op: string;
    op_id: string;
    params?: undefined;
} | {
    op: string;
    op_id: string;
    params: {
        bitLengthLeft: number;
        bitLengthRight: number;
    };
})[];
export function choice_bits_count(choice: any, offset: any): (threshold: any, receivers_list: any, compute_list: any, Zp: any, op_id: any, params: any) => any;
export function decomposition_ifelse_count(threshold: any, receivers_list: any, compute_list: any, Zp: any, op_id: any, params: any): any;
export function dynamic_bits_sdiv(dependent_op: any, count: any, protocols: any, threshold: any, receivers_list: any, compute_list: any, Zp: any, task_id: any, params: any): ({
    op: string;
    op_id: string;
    params: {
        bitLengthLeft: number;
        bitLengthRight: any;
    };
} | {
    op: string;
    op_id: string;
    params?: undefined;
})[];
export function dynamic_bits_cdiv(dir: any): (dependent_op: any, count: any, protocols: any, threshold: any, receivers_list: any, compute_list: any, Zp: any, task_id: any, params: any) => ({
    op: string;
    op_id: string;
    params: {
        bitLength: number;
        constantBits: any;
        bitLengthLeft?: undefined;
        bitLengthRight?: undefined;
    };
} | {
    op: string;
    op_id: string;
    params: {
        bitLengthLeft: number;
        bitLengthRight: any;
        bitLength?: undefined;
        constantBits?: undefined;
    };
} | {
    op: string;
    op_id: string;
    params?: undefined;
})[];
export function dynamic_rejection_sampling(dependent_op: any, count: any, protocols: any, threshold: any, receivers_list: any, compute_list: any, Zp: any, task_id: any, params: any, task: any, jiff: any): any[];
export function dynamic_random_and_quotient(dependent_op: any, count: any, protocols: any, threshold: any, receivers_list: any, compute_list: any, Zp: any, task_id: any, params: any, task: any, jiff: any): {
    op: string;
    op_id: string;
    receivers_list: any;
    threshold: any;
    params: {
        compute_threshold: any;
    };
}[];
export function dynamic_fast_exponentiation(dependent_op: any, count: any, protocols: any, threshold: any, receivers_list: any, compute_list: any, Zp: any, task_id: any, params: any, task: any, jiff: any): {
    op: string;
    op_id: string;
}[];
export function handler_cpow_Zp_minus_1(threshold: any, receivers_list: any, compute_list: any, Zp: any, op_id: any, params: any, task: any, jiff: any): any;
