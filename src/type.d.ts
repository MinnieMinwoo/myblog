interface UserPostData {
  id: string[];
  postCount: number;
  postList: PostThumbnail[];
}

interface PostThumbnail {
  id: string;
  title: string;
  thumbnailImageURL: string;
  thumbnailData: string;
  tag: string[];
  createdBy: string;
  createdAt: number;
}

interface UserInfo {
  id: string;
  email: string;
  nickname: string;
}
