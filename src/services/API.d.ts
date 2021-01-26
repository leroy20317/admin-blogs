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
  describe: string;
  color: string;
  icp: string;
};

type BgMusic = {
  about: string;
  letter: string;
  mood: string;
};

type Email = {
  address: string;
  name: string;
  mark: string;
};

declare namespace API {
  export type CurrentUser = {
    email: Email;
    bg_music: BgMusic;
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
  };

  export type Dashboard = {
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

  export type ArticleList = {
    total: number;
    data: Article[];
    page: number;
  };

  export type Envelope = {
    _id: string;
    content: string;
    contentHtml: string;
    time: string;
    __v: number;
  };

  export type EnvelopeList = {
    total: number;
    data: Envelope[];
    page: number;
  };

  export type Comment = {
    status: number;
    type: number;
    _id: string;
    image: number;
    name: string;
    time: string;
    email: string;
    content: string;
    topic_id: number;
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
