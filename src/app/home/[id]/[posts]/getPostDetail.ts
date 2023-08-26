export default async function getPostDetail(id: string) {
  console.log(process.env.WEB_DOMAIN);
  console.log(id);
  try {
    const result = await fetch(`${process.env.WEB_DOMAIN}/posts/detail/${id}`, {
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
