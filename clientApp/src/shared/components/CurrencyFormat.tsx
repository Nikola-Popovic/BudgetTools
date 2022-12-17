import * as React from 'react';

interface ICurrencyFormatProps {
  value: number;
}

export function CurrencyFormat(props: ICurrencyFormatProps) {
  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });
  return (
    <span>
      {formatter.format(props.value)}
    </span>
  );
}