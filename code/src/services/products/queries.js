import { API } from "./api";

export const getItems = async () => {
  return await API("/items");
};

export const getItem = async (id) => {
  return await API(`/items/${id}`);
};
