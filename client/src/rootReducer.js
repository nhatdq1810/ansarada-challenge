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
        isExpanded: true,
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

const expandParent = (parents, parentId) => {
  return parents.map((parent) => {
    if (parent.id === parentId) {
      return {
        ...parent,
        isExpanded: !parent.isExpanded,
      }
    } else if (parent.children && parent.children.length > 0) {
      return {
        ...parent,
        children: expandParent(parent.children, parentId),
      }
    }
    return parent;
  });
}

const setExpandedStatus = (parents, isExpanded) => {
  return parents.map((parent) => {
    if (parent.children && parent.children.length > 0) {
      return {
        ...parent,
        children: setExpandedStatus(parent.children, isExpanded),
        isExpanded,
      }
    }

    return {
      ...parent,
      isExpanded,
    }
  });
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_DOCUMENTS.SUCCESS: {
      const { fetchInfo, documents } = action.payload;

      if (fetchInfo) {
        let newDocuments = [];

        if (fetchInfo.parentId) {
          newDocuments = assignChildrenToDoc(state.documents, fetchInfo.parentId, documents);
        } else if (fetchInfo.includeChildren !== undefined) {
          newDocuments = setExpandedStatus(documents, fetchInfo.includeChildren === 1);
        }

        return {
          ...state,
          documents: newDocuments,
        };
      }

      return {
        ...state,
        documents: action.payload.documents.map((doc) => {
          return {
            ...doc,
            isExpanded: false,
          };
        }),
      };
    }
    case actionTypes.TOGGLE_FOLDER: {
      return {
        ...state,
        documents: expandParent(state.documents, action.payload),
      }
    }
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  app,
});

export default rootReducer;
