export default async function getUserCategoryData(nickname: string) {
  try {
    const { category }: { category: CategoryMainData[] } = await (
      await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/categories/${nickname}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    if (!category) throw new Error("No category data.");
    else return category;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
