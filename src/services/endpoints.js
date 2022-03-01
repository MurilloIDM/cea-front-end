import { formatQuery } from "../utils/formatQuery";

const ADMINISTRATOR = "Administrator";
const LEADS = "Leads"

const ROUTES = [];

ROUTES[ADMINISTRATOR] = {
  listPerPage: (queries) => `/administrators/?${formatQuery(queries)}`,
  create: () => "/administrators/",
  update: (id) => `/administrators/${id}`,
  delete: (id) => `/administrators/${id}`
};

ROUTES[LEADS] = {
  listPerPage: (queries) => `/leads/?${formatQuery(queries)}`,
  create: () => "/leads/",
  listAll: () => "/leads/all",
}

export {
  ROUTES,
  ADMINISTRATOR,
  LEADS
};
