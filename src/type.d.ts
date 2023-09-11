interface PostList {
  postList: PostThumbnail[];
  LastEvaluatedKey?: LastPost;
}

type UserPostList = PostList & {
  postCount: number;
  id: string[];
};

interface PostThumbnail {
  id: string;
  title: string;
  createdBy: string;
  createdNickname: string;
  createdAt: number;
  thumbnailImageURL: string;
  thumbnailData: string;
  tag: string[];
}

interface LastPost {
  id: string;
  createdBy: string;
  createdAt: string;
}

type PostDetail = PostThumbnail & {
  categoryMain: string;
  categorySub: string;
  postDetail: string;
  likes: string[];
};

interface UserInfo {
  id: string;
  email: string;
  nickname: string;
  picture: string;
}

interface CategoryMainData {
  name: string;
  subCategory: categorySubData[];
}

interface categorySubData {
  name: string;
  thumbnailImageURL: string;
}

interface IdTokenPayload {
  aud: string;
  auth_time: number;
  "cognito:username": string;
  email: string;
  email_verified: boolean;
  event_id: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nickname: string;
  origin_jti: string;
  sub: string;
  token_use: string;
}
