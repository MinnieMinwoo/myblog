export default async function updateCategoryList(
  id: string,
  nickname: string,
  categoryData: CategoryMainData[]
): Promise<CategoryMainData[]> {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_WEB_DOMAIN}/categories/${nickname}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        category: categoryData,
      }),
    });

    const { category }: { category: CategoryMainData[] } = await result.json();
    return category;
  } catch (error) {
    throw error;
  }
}
