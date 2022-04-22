import { formatQuery } from "../utils/formatQuery";

const ADMINISTRATOR = "Administrator";
const FREEPOST = "Freepost";
const LEADS = "Leads";
const STUDENTS = "Students";

const ROUTES = [];

ROUTES[ADMINISTRATOR] = {
  listPerPage: (queries) => `/administrators/?${formatQuery(queries)}`,
  create: () => "/administrators/",
  update: (id) => `/administrators/${id}`,
  delete: (id) => `/administrators/${id}`,
};

ROUTES[FREEPOST] = {
  listPerPage: (queries) => `/freeposts/?${formatQuery(queries)}`,
  create: () => "/freeposts/",
  update: (id) => `/freeposts/${id}`,
  delete: (id) => `/freeposts/${id}`,
};

ROUTES[LEADS] = {
  listPerPage: (queries) => `/leads/?${formatQuery(queries)}`,
  listAll: () => "/leads/all",
}
ROUTES[STUDENTS] = {
  listPerPage: (queries) => `/students/?${formatQuery(queries)}`,
  getById: (id) => `/student/${id}`,
}

export {
  ROUTES,
  ADMINISTRATOR,
  FREEPOST,
  LEADS,
  STUDENTS
};
