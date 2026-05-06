import api from "./api";

const ensureTaskId = (id) => {
  if (!id) {
    throw new Error("Task id is missing");
  }

  return id;
};

export const taskService = {
  list: async (params = {}) => (await api.get("/tasks", { params })).data,
  create: async (payload) => (await api.post("/tasks", payload)).data,
  update: async (id, payload) => (await api.put(`/tasks/${ensureTaskId(id)}`, payload)).data,
  remove: async (id) => (await api.delete(`/tasks/${ensureTaskId(id)}`)).data
};
