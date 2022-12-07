import React from 'react';
import ReceiptService from '../../core/services/ReceiptService';
import { ServiceProps } from './Types';


const GlobalServices: React.FC<ServiceProps> = ({children}: ServiceProps) => {
  return <ReceiptService>{children}</ReceiptService>;
};

export default GlobalServices;