export function shortenAddress(
	address: string,
	startLength = 4,
	endLength = 4
) {
	if (address == null || address === '') return '';
	if (address.length < startLength + endLength) {
		return address;
	}
	return `${address.slice(0, startLength)}…${address.slice(-endLength)}`;
}