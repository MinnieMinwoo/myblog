export default async function uploadPost(postData: PostEditData) {
  const postBody = {
    ...postData,
  };

  try {
    const result = await fetch(
      `https://pazbu1m48b.execute-api.ap-northeast-2.amazonaws.com/myblog/postlists/${postData.createdNickname}`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
      }
    );
    const { postID } = await result.json();
    return postID;
  } catch (error) {
    throw error;
  }
}
