import * as React from 'react';
import PropTypes from 'prop-types';
import { NumericFormat  }  from 'react-number-format';

const CurrencyNumberFormat = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat 
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value === undefined || values.value === null ? 0 : values.value,
          },
        });
      }}
      style={{ textAlign: 'end', fontFamily: 'monospace' }}
      decimalScale={2}
      placeholder='0.00'
      thousandSeparator={false}
      suffix='$'
    />
  );
});

CurrencyNumberFormat.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default CurrencyNumberFormat;