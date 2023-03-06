import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./redux/app/store";

// import { positions, transitions, Provider as AlertProvider } from "react-alert";
// import AlertTemplate from "./react-alert-template";

const container = document.getElementById("root")!;
const root = createRoot(container);

// const options = {
//   timeout: 5000,
//   position: positions.BOTTOM_CENTER,
//   transition: transitions.SCALE,
// };

root.render(
    <Provider store={store}>
      {/* <AlertProvider template={options}> */}
      <App />
      {/* </AlertProvider> */}
    </Provider>
);
