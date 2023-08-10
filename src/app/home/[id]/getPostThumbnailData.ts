export default async function getPostThumbnailData(id: string) {
  try {
    const result = await fetch(`https://b88yhx9gmh.execute-api.ap-northeast-2.amazonaws.com/dev/posts/${id}`, {
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
