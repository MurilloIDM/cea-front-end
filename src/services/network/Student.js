import { ceaAPI } from "../axios";
import { ROUTES, STUDENTS } from "../endpoints";

const Student = {
  listPerPage: (query) => {
    return ceaAPI.get(ROUTES[STUDENTS].listPerPage(query));
  },
  importStudents: (file) => {
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    const headers = { "Content-Type": "multipart/form-data" };
    return ceaAPI.post(ROUTES[STUDENTS].importStudents(), bodyFormData, { headers });
  },
  updateName: (payload, id) => {
    return ceaAPI.patch(ROUTES[STUDENTS].updateName(id), payload);
  },
  updateDateInactivation: (payload, id) => {
    return ceaAPI.patch(ROUTES[STUDENTS].updateDateInactivation(id), payload);
  }
};

export default Student;