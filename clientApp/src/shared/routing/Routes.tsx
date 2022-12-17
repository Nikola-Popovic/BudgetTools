import React from 'react';
import { ReceiptTracker } from '../../pages/ReceiptTracker';
import {
  createBrowserRouter, Navigate,
} from 'react-router-dom';
import { ModifyReceiptPage } from '../../pages/Receipt/ModifyReceiptPage';

export const Router = createBrowserRouter([
  {
    path: '/receiptTracker',
    element: <ReceiptTracker />,
  },
  {
    path: '/receiptTracker/receipt/:id',
    element: <ModifyReceiptPage />
  },
  {
    path: '',
    element: <Navigate to="/receiptTracker" replace/>,
  }
], );