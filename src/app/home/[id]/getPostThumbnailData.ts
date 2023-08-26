export default async function getPostThumbnailData(id: string, queryObject?: LastPost) {
  const queryString = queryObject
    ? `?${Object.entries(queryObject)
        .map(([key, value]) => value && key + "=" + value)
        .filter((v) => v)
        .join("&")}`
    : "";

  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_WEB_DOMAIN}/posts/${id}${queryString}`, {
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
