import { ceaAPI } from "../axios";
import { ROUTES, STUDENTS } from "../endpoints";

const Student = {
  listPerPage: async (query) => {
    return await ceaAPI.get(ROUTES[STUDENTS].listPerPage(query));
  },

  getById: async () => {
    return await ceaAPI.get(ROUTES[STUDENTS].getById());
  }

};

export default Student;