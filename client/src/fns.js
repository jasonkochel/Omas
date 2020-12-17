import { format, parseISO } from 'date-fns';

const sortDir = { ASC: 'asc', DESC: 'desc' };

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

const formatNumber = (val, precision) =>
  val.toLocaleString(undefined, {
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  });

const sortArray = (array, sortKey, direction = sortDir.ASC) => {
  const sortVal = direction === sortDir.DESC ? 1 : -1;
  return array.sort((a, b) => (a[sortKey] < b[sortKey] ? sortVal : sortVal * -1));
};

function validateDecimal(length, precision) {
  const validatePrecision = (value, precision) => {
    var exp = '^\\d*(.\\d{0,' + precision.toString() + '})?$';
    var re = new RegExp(exp, 'g');
    return (value + '').match(re);
  };

  return this.moreThan(0, 'Min 0.01')
    .lessThan(1000000, 'Max 999,999.99') // TODO: respect length
    .test('is-decimal', `Max ${precision} decimal places`, val =>
      validatePrecision(val, precision)
    );
}

const noop = () => {};

export default {
  arrayToObject,
  formatCurrency,
  formatDate,
  formatDateLong,
  formatNumber,
  validateDecimal,
  noop,
  sortArray,
  sortDir,
};
