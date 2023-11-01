import useSWR from "swr";
import axiosInstance from "@/app/_lib/axios";
import { IArticleData } from "@/app/_type/config";

export const useGetCatalog = () => {
  const key = "/api/getCatalog";
  const fetcher = (url: string) =>
    axiosInstance.get<IArticleData, IArticleData>(url);
  const { data, error, isLoading } = useSWR(key, fetcher);
  return {
    catalogKey: key,
    catalog: data,
    catalogFetchError: error,
    isCatalogFetchLoading: isLoading,
  };
};
