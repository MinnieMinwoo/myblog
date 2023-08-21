export default async function getPostDetail(id: string) {
  const url = `https://pazbu1m48b.execute-api.ap-northeast-2.amazonaws.com/myblog/posts/${id}`;
  console.log(url);
  try {
    const result = await fetch(`https://pazbu1m48b.execute-api.ap-northeast-2.amazonaws.com/myblog/posts/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 10 },
    });
    const response: PostDetail = await result.json();
    return response;
  } catch (error) {
    throw error;
  }
}
