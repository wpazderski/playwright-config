/**
 * Makes all properties of T required and non-nullable.
 */
export type RequiredNonNullable<T> = Required<{
    [P in keyof T]: NonNullable<T[P]>;
}>;
