import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import createStore from './utils/createStore';
import Tree from './components/Tree';

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.store = createStore();
  }

  render() {
    return (
      <Provider store={this.store}>
        <MuiThemeProvider>
          <Tree />
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
