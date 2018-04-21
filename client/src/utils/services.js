import queryString from 'query-string';

import { HOST, PORT } from './constants';

const services = {
  fetchDocuments(query) {
    return new Promise((resolve, reject) => {
      fetch(`${HOST}:${PORT}/documents${query ? `?${queryString.stringify(query)}` : ''}`)
        .then((resp) => { return resp.json(); })
        .then((resp) => { resolve(resp); })
        .catch((err) => {
          console.error(err);
          reject(err);
        })
    })
  }
}

export default services;
