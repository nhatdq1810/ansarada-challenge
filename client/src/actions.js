const FETCH_DOCUMENTS = {
  START: 'FETCH_DOCUMENTS_START',
  SUCCESS: 'FETCH_DOCUMENTS_SUCCESS',
  ERROR: 'FETCH_DOCUMENTS_ERROR',
};

const fetchDocuments = {
  start(payload) {
    return {
      type: FETCH_DOCUMENTS.START,
      payload,
    }
  },
  success(payload) {
    return {
      type: FETCH_DOCUMENTS.SUCCESS,
      payload,
    }
  },
  error(payload) {
    return {
      type: FETCH_DOCUMENTS.ERROR,
      payload,
    }
  },
}

const actions = { fetchDocuments };
const actionTypes = { FETCH_DOCUMENTS };

export { actions, actionTypes };
