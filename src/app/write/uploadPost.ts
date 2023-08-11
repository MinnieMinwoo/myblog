export default function uploadPost(id: string) {
  try {
    const result = fetch(`https://pazbu1m48b.execute-api.ap-northeast-2.amazonaws.com/myblog/posts/${id}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}
