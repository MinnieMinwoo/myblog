export default async function getPostDetail(id: string) {
  try {
    const result = await fetch(`http://localhost:3000/api/posts/${id}`, {
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
