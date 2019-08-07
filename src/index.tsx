import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import { mergeStyles } from "office-ui-fabric-react";
import { createStore } from "redux";
import { rootReducer } from "./state";
import { Provider } from "react-redux";

// Inject some global styles
mergeStyles({
  selectors: {
    ":global(body), :global(html), :global(#app)": {
      width: 300,
      maxWidth: 344,
      height: 344,
      maxHeight: 344,
      margin: 0,
      padding: 0
    }
  }
});

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
