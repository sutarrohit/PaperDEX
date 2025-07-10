export const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "API request failed");
  }
  return data;
};
