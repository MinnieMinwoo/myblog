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

interface PostEditData {
  title: string;
  category: string[];
  postData: string;
  thumbnailImgLink: string;
  thumbnailData: string;
  tag: string[];
}

interface CategoryData {
  mainField: string;
  subField: string[];
  thumbnailLink: string[];
}
