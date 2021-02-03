import { request } from 'umi';
import url from '@/utils/url';

export type LoginParamsType = {
  username: string;
  password: string;
  passwords?: string;
};

export async function loginIn(params: LoginParamsType) {
  return request(url.login, {
    method: 'POST',
    data: params,
  });
}

export async function loginUp(params: LoginParamsType) {
  return request(url.register, {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/login/outLogin');
}
