/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const dateDiff = (time: string) => {
  const timestemp = new Date(time).getTime();
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const now = new Date().getTime();
  const diffValue = now - timestemp;

  // 如果本地时间反而小于变量时间
  if (diffValue < 0) {
    return 'Just Now';
  }

  // 计算差异时间的量级
  const monthC = diffValue / month;
  const weekC = diffValue / (7 * day);
  const dayC = diffValue / day;
  const hourC = diffValue / hour;
  const minC = diffValue / minute;

  const map = {
    [monthC]: "月",
    [weekC]: "周",
    [dayC]: "天",
    [hourC]: "小时",
    [minC]: "分钟",
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const i in map) {
    if (Number(i) >= 1) {
      return `${parseInt(i, 10)}${map[i]}前`
    }
  }
  return '片刻之前';
}
