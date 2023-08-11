export default async function getPostThumbnailData(id: string) {
  try {
    const result = await fetch(`https://pazbu1m48b.execute-api.ap-northeast-2.amazonaws.com/myblog/posts/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response: UserPostData = await result.json();
    return response;
  } catch (error) {
    throw error;
  }
}
