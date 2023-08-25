export default async function getPostDetail(id: string) {
  console.log(id);
  try {
    const result = await fetch(`${process.env.WEB_DOMAIN}/${id}`, {
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
