import { request } from 'umi';
import url from '@/utils/url';

interface Params extends Record<string, any> {
  id?: number | string;
}

export async function fetch({ mode, ...params }: any) {
  const res: any = await request(`${url.clash}/${mode || ''}`, {
    method: 'get',
    params,
  });

  if (mode === 'rules') {
    res.body.data.forEach((ele: API.Clash['rules'][number]) => {
      ele.mode = ele.mode.toString();
      ele.type = ele.type.toString();
      ele.resolve = ele.resolve ? '1' : '0';
    });
  } else {
    res.body.forEach((ele: any) => {
      ele.id = ele.id.toString();
    });
  }
  return res;
}

export async function update({ id, data }: { id: any; data: Record<string, any> }) {
  return request(`${url.clash}/${id || ''}`, {
    method: 'put',
    data,
  });
}

export async function create(data: Params) {
  return request(url.clash, {
    method: 'post',
    data,
  });
}

export async function del({ id }: Params) {
  return request(`${url.clash}/${id}`, {
    method: 'delete',
  });
}
