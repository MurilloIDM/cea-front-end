import { formatQuery } from "../utils/formatQuery";

const ADMINISTRATOR = "Administrator";
const FREEPOST = "Freepost";
const LEADS = "Leads";
const AUTH = "Auth";
const EXCLUSIVEPOST = "Exclusivepost";
const STUDENTS = "Students";
const COMMENTS = "Comments";

const ROUTES = [];

ROUTES[ADMINISTRATOR] = {
  listPerPage: (queries) => `/admin/administrators/?${formatQuery(queries)}`,
  create: () => "/admin/administrators/",
  update: (id) => `/admin/administrators/${id}`,
  delete: (id) => `/admin/administrators/${id}`,
  generatePassword: () => '/admin/administrators/password/generate',
  createPassword: () => '/admin/administrators/password/create',
};

ROUTES[FREEPOST] = {
  listPerPage: (queries) => `/admin/free-posts/?${formatQuery(queries)}`,
  create: () => "/admin/free-posts/",
  update: (id) => `/admin/free-posts/${id}`,
  delete: (id) => `/admin/free-posts/${id}`,
};

ROUTES[LEADS] = {
  listPerPage: (queries) => `/admin/leads/?${formatQuery(queries)}`,
  listAll: () => "/admin/leads/all",
};

ROUTES[AUTH] = {
  login: () => "/admin/login",
};

ROUTES[EXCLUSIVEPOST] = {
  listPerPage: (queries) => `/admin/exclusive-posts/?${formatQuery(queries)}`,
  inative: (id) => `/admin/exclusive-posts/${id}`,
  createContent: () => '/admin/exclusive-posts/content',
  createSurvey: () => '/admin/exclusive-posts/survey',
  findMedia: (id) => `/admin/media/exclusive-post/${id}`,
  findPollTopics: (id) => `/admin/poll-topics/exclusive-post/${id}`,
  editContent: (id) => `/admin/exclusive-posts/content/${id}`,
  editSurvey: (id) => `/admin/exclusive-posts/survey/${id}`,
  findLinks: (id) => `/admin/links/exclusive-post/${id}`,
}

ROUTES[STUDENTS] = {
  listPerPage: (queries) => `/admin/students/?${formatQuery(queries)}`,
  importStudents: () => '/admin/students/upload',
  updateName: (id) => `/admin/students/${id}`,
  updateDateInactivation: (id) => `/admin/students/inactivate/${id}`
}

ROUTES[COMMENTS] = {
  listCommentsPerPage: (queries, id) => `/admin/comments/exclusive-post/${id}/?${formatQuery(queries)}`,
  inativeComment: () => `/admin/comments/`,
  listRepliesPerPage: (queries, id) => `/admin/comments/${id}/comments-reply/?${formatQuery(queries)}`,
  inativeReply: () => `/admin/comments/reply`,
  createReply: () => `/admin/comments/reply/create`,
  addComments: () => `/admin/comments/create`,
}

export {
  ROUTES,
  ADMINISTRATOR,
  FREEPOST,
  LEADS,
  AUTH,
  EXCLUSIVEPOST,
  STUDENTS,
  COMMENTS,
};
