export function isExists<T>(value: T | undefined | null): value is T {
	return value !== undefined && value !== null;
}