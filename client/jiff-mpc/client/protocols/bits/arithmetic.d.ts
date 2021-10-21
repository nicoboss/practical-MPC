export function cadd(jiff: any, bits: any, constant: number, op_id?: string): any;
export function csubl(jiff: any, bits: any, constant: number, op_id?: string): any;
export function csubr(jiff: any, constant: number, bits: any, op_id?: string): any;
export function sadd(jiff: any, bits1: any, bits2: any, op_id?: string): any;
export function ssub(jiff: any, bits1: any, bits2: any, op_id?: string): any;
export function cmult(jiff: any, bits: any, constant: number, op_id?: string): any;
export function smult(jiff: any, bits1: any, bits2: any, op_id?: string): any;
export function sdiv(jiff: any, bits1: any, bits2: any, op_id?: string): {
    quotient: any;
    remainder: any;
};
export function cdivl(jiff: any, bits: any, constant: number, op_id?: string): {
    quotient: any;
    remainder: any;
};
export function cdivr(jiff: any, constant: number, bits: any, op_id?: string): {
    quotient: any;
    remainder: any;
};
