import api from "./api";

export const dashboardService = {
  get: async () => (await api.get("/dashboard")).data,
  telegramStatus: async () => (await api.get("/telegram/status")).data,
  sendTelegramTest: async (message) =>
    (await api.post("/telegram/send-test", { message })).data
};
