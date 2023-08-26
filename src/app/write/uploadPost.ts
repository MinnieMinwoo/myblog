export default async function uploadPost(postData: PostEditData) {
  const postBody = {
    ...postData,
  };

  try {
    const result = await fetch(`${process.env.WEB_DOMAIN}/posts/${postData.createdNickname}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    });
    const { postID } = await result.json();
    return postID;
  } catch (error) {
    throw error;
  }
}
