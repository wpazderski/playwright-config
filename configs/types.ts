export type RequiredNonNullable<T> = Required<{
    [P in keyof T]: NonNullable<T[P]>;
}>;
