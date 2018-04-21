import { combineReducers } from 'redux';

import { actionTypes } from './actions';

const initialState = {
  documents: [],
};

const assignChildrenToDoc = (parents, parentId, children) => {
  return parents.map((parent) => {
    if (parent.id === parentId) {
      return {
        ...parent,
        children,
      }
    } else if (parent.children && parent.children.length > 0) {
      return {
        ...parent,
        children: assignChildrenToDoc(parent.children, parentId, children),
      }
    }
    return parent;
  });
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_DOCUMENTS.SUCCESS: {
      const { fetchInfo, documents } = action.payload;

      if (fetchInfo) {
        if (fetchInfo.parentId) {
          return {
            ...state,
            documents: assignChildrenToDoc(state.documents, fetchInfo.parentId, documents),
          };
        }
      }

      return {
        ...state,
        documents: action.payload.documents,
      };
    }
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  app,
});

export default rootReducer;
