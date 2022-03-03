import { ceaAPI } from "../axios";
import { ROUTES, LEADS } from "../endpoints";

const Lead = {
  listPerPage: async (query) => {
    return await ceaAPI.get(ROUTES[LEADS].listPerPage(query));
  },

  listAll: async () => {
    return await ceaAPI.get(ROUTES[LEADS].listAll());
  }

};

export default Lead;