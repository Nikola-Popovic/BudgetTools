import React from 'react';
import { ReceiptTracker } from '../../pages/ReceiptTracker';
import {
  createBrowserRouter, createRoutesFromElements, Navigate, Route,
} from 'react-router-dom';
import { ModifyReceiptPage } from '../../pages/Receipt/ModifyReceiptPage';
import { AppLayout } from '../layouts/AppLayout';
 
export const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/receiptTracker" element={<ReceiptTracker />} />
      <Route path="/receiptTracker/receipt/:id" element={<ModifyReceiptPage />} />
      <Route path="" element={<Navigate to="/receiptTracker" replace/>} />
    </Route>
  ));