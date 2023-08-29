import getCurrentUserToken from "./getCurrentUserToken";

export default async function updateCategoryList(
  id: string,
  nickname: string,
  categoryData: CategoryMainData[]
): Promise<CategoryMainData[]> {
  try {
    const token = await getCurrentUserToken();
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/categories/${nickname}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: categoryData,
      }),
    });

    const { category }: { category: CategoryMainData[] } = await result.json();
    return category;
  } catch (error) {
    throw error;
  }
}
