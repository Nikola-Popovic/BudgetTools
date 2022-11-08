import React from 'react';
import { Homepage } from '../../pages/Homepage';
import {
  createBrowserRouter,
} from 'react-router-dom';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />
  }
]);