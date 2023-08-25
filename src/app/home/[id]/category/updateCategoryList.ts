export default async function updateCategoryList(
  id: string,
  nickname: string,
  categoryData: CategoryMainData[]
): Promise<CategoryMainData[]> {
  try {
    const result = await fetch(
      `https://pazbu1m48b.execute-api.ap-northeast-2.amazonaws.com/myblog/category/${nickname}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          category: categoryData,
        }),
      }
    );

    const { category }: { category: CategoryMainData[] } = await result.json();
    return category;
  } catch (error) {
    throw error;
  }
}
