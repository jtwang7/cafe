import axiosInstance from "@/app/_lib/axios";
import useSWR from "swr";

export const useGetTotalTags = () => {
  const key = "/api/getTotalTags";
  const fetcher = (url: string) => axiosInstance.get<string[], string[]>(url);
  const { data, error, isLoading } = useSWR(key, fetcher);

  return {
    tagsKey: key,
    tags: data,
    tagsFetchError: error,
    isTagsLoading: isLoading,
  };
};
