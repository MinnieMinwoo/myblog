export default async function uploadPost(id: string, nickname: string, postData: PostEditData) {
  const postBody = {
    createdBy: id,
    ...postData,
  };

  try {
    const result = fetch(`https://pazbu1m48b.execute-api.ap-northeast-2.amazonaws.com/myblog/posts/${nickname}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    });
    return result;
  } catch (error) {
    throw error;
  }
}
