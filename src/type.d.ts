interface UserPostData {
  id: string[];
  postCount: number;
  postList: PostThumbnail[];
  LastEvaluatedKey: LastPost;
}

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
}

interface CategoryMainData {
  name: string;
  subCategory: categorySubData[];
}

interface categorySubData {
  name: string;
  thumbnailImageURL: string;
}

enum ErrorMessage {
  NO_IMAGE_DATA = "No image data",
  INVALID_TOKEN_DATA = "Wrong token data",
  INVALID_TOKEN_TYPE = "Invalid token type",
  TOKEN_CONTAMINATED = "Get contaminated token",
  MODIFY_OTHER_USER = "Attempting to modify other people's information",
  USER_NOT_EXISTS = "User not exists in database",
  POST_NOT_EXISTS = "Post not exists in database",
  INTERNAL_SERVER_ERROR = "Internal server error",
  DB_CONNECTION_ERROR = "Connection error to database",
  GATEWAY_ERROR = "Bad gateway",
}
