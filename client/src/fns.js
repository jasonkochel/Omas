import { format, parseISO } from 'date-fns';

const formatDate = (date, fmt = 'P') => format(parseISO(date), fmt);

const formatDateLong = date => formatDate(date, 'PPPP');

const formatCurrency = val =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

const noop = () => {};

export default { formatDate, formatDateLong, formatCurrency, noop };
