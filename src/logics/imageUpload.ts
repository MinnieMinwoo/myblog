import getCurrentUserToken from "./getCurrentUserToken";

export default async function imageUpload(image: File) {
  try {
    const token = await getCurrentUserToken();
    const form = new FormData();
    form.append("image", image);
    // fetch headers 에 multipart 를 주면 form 수신이 안됨.
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    const { imageURL } = await result.json();
    return imageURL;
  } catch (error) {
    throw error;
  }
}
