const FETCH_DOCUMENTS = {
  START: 'FETCH_DOCUMENTS_START',
  SUCCESS: 'FETCH_DOCUMENTS_SUCCESS',
  ERROR: 'FETCH_DOCUMENTS_ERROR',
};
const TOGGLE_FOLDER = 'TOGGLE_FOLDER';

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
const toggleFolder = (payload) => {
  return {
    type: TOGGLE_FOLDER,
    payload,
  };
};

const actions = { fetchDocuments, toggleFolder };
const actionTypes = { FETCH_DOCUMENTS, TOGGLE_FOLDER };

export { actions, actionTypes };
