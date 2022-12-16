import axios, { AxiosRequestConfig } from "axios";
import { Gif } from "../../utils/interfaces/gif.interface";
import { CreateGifArgs, DeleteGifArgs } from "./gif-service.interface";

export const gifService = axios.create({
  baseURL: process.env.REACT_APP_GIF_BASE_URL,
});

export const fullfilledReq = (config: AxiosRequestConfig<any>) => {
  if (config.method !== "get") {
    config.data = {
      ...config.data,
      author_id: process.env.REACT_APP_AUTHOR_ID,
    };
  }
  return config;
};

gifService.interceptors.request.use(fullfilledReq);

export const getGifs = () =>
  gifService.get<Gif[]>(`/?author_id=${process.env.REACT_APP_AUTHOR_ID}`);

export const createGif = (createGifArgs: CreateGifArgs) =>
  gifService.post<Gif>("", createGifArgs);

export const deleteGif = (deleteGifArgs: DeleteGifArgs) =>
  gifService.delete<Gif>("", { data: deleteGifArgs });
