/**
 *
 * @param {number} timestamp
 * @returns
 */
export function timestampToDate(timestamp: number): Date;
/**
 *
 * @param {Date} old
 * @param {Date} current
 * @returns
 */
export function getTimestamp(old: Date, current: Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
};
/**
 *
 * @param {number} seconds
 * @returns
 */
export function intToTimeString(seconds: number): {
    seconds: number;
    minutes: number;
    hour: number;
    string: string;
    timestamp: number;
};
