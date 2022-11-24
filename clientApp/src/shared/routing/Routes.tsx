import React from 'react';
import { Homepage } from '../../pages/Homepage';
import { ReceiptTracker } from '../../pages/ReceiptTracker';
import { TimeBudget } from '../../pages/TimeBudget';
import {
  createBrowserRouter,
} from 'react-router-dom';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />
  },
  {
    path: '/receiptTracker',
    element: <ReceiptTracker />
  },
  {
    path: '/timeBudget',
    element: <TimeBudget />
  }
]);