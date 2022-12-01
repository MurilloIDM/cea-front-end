import { ceaAPI } from "../axios";
import { ROUTES, COMMENTS } from "../endpoints";

const Comments = {
  listCommentsPerPage: (id, query) => {
    return ceaAPI.get(ROUTES[COMMENTS].listCommentsPerPage(id, query));
  },
  inativeComment: (payload) => {
    return ceaAPI.patch(ROUTES[COMMENTS].inativeComment(), payload);
  },
  listRepliesPerPage: (id, query) => {
    return ceaAPI.get(ROUTES[COMMENTS].listRepliesPerPage(id, query));
  },
  inativeReply: (payload) => {
    return ceaAPI.patch(ROUTES[COMMENTS].inativeReply(), payload);
  },
  createReply: (payload) => {
    return ceaAPI.post(ROUTES[COMMENTS].createReply(), payload);
  },
  addComment: (payload) => {
    return ceaAPI.post(ROUTES[COMMENTS].addComments(), payload);
  }
};

export default Comments;