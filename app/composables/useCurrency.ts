export const useCurrency = () => {
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(value || 0)
	}

	const formatNumber = (value: number) => {
		return new Intl.NumberFormat('es-MX', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(value || 0)
	}

	return {formatCurrency, formatNumber}
}
