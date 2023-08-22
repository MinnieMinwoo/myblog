export default async function getPostThumbnailData(id: string, queryObject?: LastPost) {
  const queryString = queryObject
    ? `?${Object.entries(queryObject)
        .map(([key, value]) => value && key + "=" + value)
        .filter((v) => v)
        .join("&")}`
    : "";

  try {
    const result = await fetch(
      `https://pazbu1m48b.execute-api.ap-northeast-2.amazonaws.com/myblog/postlists/${id}${queryString}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response: UserPostData = await result.json();
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
}
