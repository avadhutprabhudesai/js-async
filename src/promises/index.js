/* eslint-disable no-unused-vars */

import { api } from './api';
import { chaining } from './chaining';
import { errorHandling } from './error-handling';
import './ex4';
import { poc } from './poc';
export const promises = () => {
  /**
   *====================PRO POC====================
   *====================APIs====================
   *====================PROMISE CHAINING====================
   *====================ERROR HANDLING====================
   *====================GOTCHAS====================
   *====================AGAINST POC====================
   */

  poc();
  api();
  chaining();
  errorHandling();
};
