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

interface PostDetail {
  id: string;
  title: string;
  createdBy: string;
  createdNickname: string;
  createdAt: number;
  categoryMain: string;
  categorySub: string;
  thumbnailImageURL: string;
  postDetail: string;
  tag: string[];
  likes: string[];
}

interface UserInfo {
  id: string;
  email: string;
  nickname: string;
}

type PostEditData = PostThumbnail & PostDetail;

interface CategoryData {
  mainField: string;
  subField: string[];
  thumbnailLink: string[];
}
