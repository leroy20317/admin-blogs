

interface Time {
  date: string;
  time: string;
  year: string;
  month: Month;
  day: Day;
  week: Week;
}

type Week = Day;

interface Day {
  on: string;
  en: string;
}

interface Month {
  on: string;
  cn: string;
  en: string;
}


type Image = Music;

interface Music {
  url: string;
  name: string;
}

interface Info {
  email: Email;
  bg: Bg;
  cover: Cover;
  _id: string;
  upload_type: string;
  avatar: string;
  name: string;
  web_name: string;
  address: string;
  web_describe: string;
  web_seo: string;
  __v: number;
}

interface Cover {
  image: string;
  title: string;
  date: string;
  link: string;
  describe: string;
  color: string;
  icp_txt: string;
  icp_link: string;
}

interface Bg {
  bg_about: string;
  bg_letter: string;
  bg_mood: string;
}

interface Email {
  address: string;
  name: string;
  mark: string;
}


declare namespace API {
  export type CurrentUser = {
    email: Email;
    bg: Bg;
    cover: Cover;
    _id: string;
    upload_type: string;
    avatar: string;
    name: string;
    web_name: string;
    address: string;
    web_describe: string;
    web_seo: string;
    __v: number;
  }

  export type Data = {
    info: Info;
    article: Article;
    envelope: Envelope[];
    articleQty: number;
    commentQty: number;
    unread: number;
  }

  export type Article =  {
    music: Music;
    image: Image;
    like: number;
    read: number;
    hide: boolean;
    _id: string;
    title: string;
    content: string;
    contentHtml: string;
    describe: string;
    time: string;
    words: number;
    id: number;
    __v: number;
  }

  export type Envelope = {
    _id: string;
    content: string;
    time: string;
    __v: number;
  }

  export type ArticleList =  {
    total: number;
    data: Article[];
    page: number;
  }

  export type EnvelopeList =  {
    total: number;
    data: Envelope[];
    page: number;
  }






  export type LoginStateType = {
    status?: 'ok' | 'error';
    type?: string;
  };

  export type NoticeIconData = {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  };
}
