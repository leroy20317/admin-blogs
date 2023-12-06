type Image = Music;

type Music = {
  url: string;
  name: string;
};

type Cover = {
  image: string;
  title: string;
  date: string;
  link: string;
  description: string;
  color: string;
  icp: string;
};

type BgMusic = {
  about: string;
  letter: string;
  mood: string;
};

declare namespace API {
  export type Response<T> = {
    status: string;
    body: T;
  };
  export type ResponseList<T> = {
    total: number;
    data: T;
    page: number;
  };
  export type CurrentUser = {
    name: string;
    avatar: string;
  };

  export type Info = {
    bg_music: {
      about: string;
      letter: string;
      mood: string;
    };
    cover: {
      image: string;
      title: string;
      date: string;
      link: string;
      description: string;
      color: string;
      icp: string;
    };
    admin: {
      avatar: string;
      name: string;
    };
    web: {
      name: string;
      address: string;
      description: string;
      seo: string;
    };
    _id: string;
    __v: number;
  };

  export type Home = {
    envelope: Envelope[];
    article: {
      last: Article;
      length: number;
    };
    comment: {
      length: number;
      unread: number;
    };
  };

  export type Article = {
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
  };

  export type ArticleList = ResponseList<Article[]>;

  export type Envelope = {
    _id: string;
    content: string;
    contentHtml: string;
    time: string;
    __v: number;
  };

  export type EnvelopeList = ResponseList<Envelope[]>;

  export type Comment = {
    status: number;
    type: number;
    _id: string;
    image: number;
    name: string;
    time: string;
    email: string;
    content: string;
    article_id: number;
    id: number;
    type: number;
    parent_id: number;
    reply_name: string;
    reply_email: string;

    admin: boolean;
    __v: number;
  };

  export type CommentList = {
    total: number;
    data: Comment[];
    page: number;
  };

  export type Subscribe = {
    rules: {
      _id: string;
      mode: string;
      site: string;
      type: string;
      resolve: '0' | '1';
      remark: string;
    }[];
    modes: { _id: string; id: string; name: string }[];
    types: { _id: string; id: string; name: string; write: boolean }[];
    proxies: { _id: string; content: string }[];
  };

  export type Myself = {
    _id: string;
    __v: number;
    content: string;
    contentHtml: string;
  };

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
