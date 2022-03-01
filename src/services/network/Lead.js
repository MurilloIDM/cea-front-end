import { ceaAPI } from "../axios";
import { ROUTES, LEADS } from "../endpoints";

const Lead = {
  listPerPage: async (query) => {
    return await ceaAPI.get(ROUTES[LEADS].listPerPage(query));
  },
  create: async (payload) => {
    return await ceaAPI.post(ROUTES[LEADS].create(), payload);
  },
  listAll: async () => {
    return await ceaAPI.get(ROUTES[LEADS].listAll());
  }

};

export default Lead;