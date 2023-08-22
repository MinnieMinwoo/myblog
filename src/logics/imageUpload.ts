export default async function imageUpload(image: File) {
  try {
    const form = new FormData();
    form.append("image", image);
    // fetch headers 에 multipart 를 주면 form 수신이 안됨.
    const result = await fetch(`https://pazbu1m48b.execute-api.ap-northeast-2.amazonaws.com/myblog/images`, {
      method: "POST",
      body: form,
    });
    const { imageURL } = await result.json();
    console.log(imageURL);
    return imageURL;
  } catch (error) {
    throw error;
  }
}
