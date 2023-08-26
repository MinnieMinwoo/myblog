export default async function getPostDetail(id: string) {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_WEB_DOMAIN}/posts/detail/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response: PostDetail = await result.json();
    return response;
  } catch (error) {
    throw error;
  }
}
