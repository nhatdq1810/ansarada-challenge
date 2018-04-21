import { createSelector } from 'reselect';

const getAppState = (state) => {
  return state.app;
};

const getDocuments = createSelector(
  getAppState,
  (app) => {
    return app.documents;
  },
);

export { getDocuments };
