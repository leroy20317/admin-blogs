import { request } from 'umi';
import url from '@/utils/url';

interface Params extends Record<string, any> {
  id?: number | string;
}

export async function fetch({ mode, params }: any) {
  return request(`${url.clash}/${mode || ''}`, {
    method: 'get',
    params,
  });
}

export async function updateRule({ id, data }: { id: any; data: Record<string, any> }) {
  return request(`${url.clash}/rules/${id || ''}`, {
    method: 'put',
    data,
  });
}

export async function createRule(data: Params) {
  return request(`${url.clash}/rules`, {
    method: 'post',
    data,
  });
}

export async function delRule({ id }: Params) {
  return request(`${url.clash}/rules/${id}`, {
    method: 'delete',
  });
}
