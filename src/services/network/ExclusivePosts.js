import { ceaAPI } from "../axios";
import { ROUTES, EXCLUSIVEPOST } from "../endpoints";

const ExclusivePosts = {
  listPerPage: (queries) => {
    return ceaAPI.get(ROUTES[EXCLUSIVEPOST].listPerPage(queries));
  },
  inative: (id) => {
    return ceaAPI.patch(ROUTES[EXCLUSIVEPOST].inative(id));
  },
  createContent: (payload) => {
    return ceaAPI.post(ROUTES[EXCLUSIVEPOST].createContent(), payload);
  },
  createSurvey: (payload) => {
    return ceaAPI.post(ROUTES[EXCLUSIVEPOST].createSurvey(), payload);
  },
  findMedia: (id) => {
    return ceaAPI.get(ROUTES[EXCLUSIVEPOST].findMedia(id));
  },
  findPollTopics: (id) => {
    return ceaAPI.get(ROUTES[EXCLUSIVEPOST].findPollTopics(id));
  },
  editContent: (payload, id) => {
    return ceaAPI.put(ROUTES[EXCLUSIVEPOST].editContent(id), payload);
  },
  editSurvey: (payload, id) => {
    return ceaAPI.put(ROUTES[EXCLUSIVEPOST].editSurvey(id), payload);
  },
  findLinks: (id) => {
    return ceaAPI.get(ROUTES[EXCLUSIVEPOST].findLinks(id));
  }
}

export default ExclusivePosts;
