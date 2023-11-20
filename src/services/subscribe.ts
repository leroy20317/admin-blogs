import { request } from '@umijs/max';
import url from '@/utils/url';

interface Params extends Record<string, any> {
  id?: number | string;
}

export async function fetch({ mode, params }: any) {
  return request(`${url.subscribe}/${mode || ''}`, {
    method: 'get',
    params,
  });
}

export async function updateRule({ id, data }: { id: any; data: Record<string, any> }) {
  return request(`${url.subscribe}/rules/${id || ''}`, {
    method: 'put',
    data,
  });
}

export async function createRule(data: Params) {
  return request(`${url.subscribe}/rules`, {
    method: 'post',
    data,
  });
}

export async function delRule({ id }: Params) {
  return request(`${url.subscribe}/rules/${id}`, {
    method: 'delete',
  });
}

export async function updateProxy({ id, data }: { id: any; data: Record<string, any> }) {
  return request(`${url.subscribe}/proxies/${id || ''}`, {
    method: 'put',
    data,
  });
}

export async function createProxy(data: Params) {
  return request(`${url.subscribe}/proxies`, {
    method: 'post',
    data,
  });
}

export async function delProxy({ id }: Params) {
  return request(`${url.subscribe}/proxies/${id}`, {
    method: 'delete',
  });
}
