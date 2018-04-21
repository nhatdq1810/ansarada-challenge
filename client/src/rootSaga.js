import { call, takeLatest, put } from 'redux-saga/effects';

import services from './utils/services';
import { actions, actionTypes } from './actions';

function* fetchDocuments(action) {
  try {
    const documents = yield call(services.fetchDocuments, action.payload);
    yield put(actions.fetchDocuments.success({ documents, fetchInfo: action.payload }));
  } catch (error) {
    console.error('effects error', error);
    yield put(actions.fetchDocuments.error('error'));
  }
}

function* watchFetchDocuments() {
  yield takeLatest(actionTypes.FETCH_DOCUMENTS.START, fetchDocuments);
}

export default watchFetchDocuments;
