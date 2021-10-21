export function share_bits(jiff: any, secret: number, bit_length?: number, threshold?: number, receivers_list?: any[], senders_list?: any[], Zp?: number, share_id?: string | number): any;
export function open_bits(jiff: any, bits: any, parties: number[], op_id?: string | number): Promise<any>;
export function receive_open_bits(jiff: any, senders: any[], receivers?: any[], count?: number, threshold?: number, Zp?: number, op_id?: any): Promise<any>;
