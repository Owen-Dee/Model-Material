import axios from 'axios';
import cookie from 'js-cookie';
import SetJwt from './interceptors/i18nJwt';

const local = axios.create({
  baseURL: '/',
  timeout: 3000,
  headers: { 'x-csrf-token': cookie.get('csrfToken') },
});

const gateway = axios.create({
  baseURL: '/gateway',
  timeout: 3000
});

gateway.interceptors.request.use(SetJwt);
local.interceptors.request.use(SetJwt);

export default {
  local,
  gateway
}