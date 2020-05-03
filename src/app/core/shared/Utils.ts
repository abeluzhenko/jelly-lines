export const cloneDeep = <T extends any>(value: T): T => JSON.parse(JSON.stringify(value));
