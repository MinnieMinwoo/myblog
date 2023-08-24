export default async function getCategoryList(nickname: string): Promise<CategoryMainData[]> {
  try {
    const result = await fetch(
      `https://pazbu1m48b.execute-api.ap-northeast-2.amazonaws.com/myblog/category/${nickname}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 10 },
      }
    );

    const response = await result.json();
    if (!response.category) throw new Error("No category data.");

    const categoryData: CategoryMainData[] = response.category;
    return categoryData;
  } catch (error) {
    throw error;
  }
}
