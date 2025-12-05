import { API } from "./api";

export const addItem = async (newItem) => {
  return await API("/items", {
    method: "POST",
    body: newItem,
  });
};

export const updateItem = async (id, updatedItem) => {
  return await API(`/items/${id}`, {
    method: "PUT",
    body: updatedItem,
  });
};

export const deleteItem = async (id) => {
  return await API(`/items/${id}`, {
    method: "DELETE",
  });
};
