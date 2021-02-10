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
  val?.toLocaleString(undefined, {
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

  /*
  (5,2) => max 99.99
  (5,1) => max 999.9
  (5,0) => max 99999  // special case
  */

  const decimalLength = precision === 0 ? 0 : precision + 1;
  const maxVal = Math.pow(10, length - decimalLength);

  return this.moreThan(0, 'Must be greater than zero')
    .lessThan(maxVal, `Must be less than ${maxVal}`)
    .test('is-decimal', `Max ${precision} decimal places`, val =>
      validatePrecision(val, precision)
    );
}

const noop = () => {};

const api = {
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

export default api;
