import { format, parseISO } from 'date-fns';

const arrayToObject = (array, keyField) =>
  array && Array.isArray(array)
    ? array.reduce((obj, item) => {
        obj[item[keyField]] = item;
        return obj;
      }, {})
    : {};

const formatDate = (date, fmt = 'P') => (date ? format(parseISO(date), fmt) : '');

const formatDateLong = date => formatDate(date, 'PPPP');

const formatCurrency = val =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

const noop = () => {};

export default { arrayToObject, formatDate, formatDateLong, formatCurrency, noop };
