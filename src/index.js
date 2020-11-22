
import * as WebFont from "webfontloader";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { App } from "modules";

import reportWebVitals from './reportWebVitals';
import "./assets/global.scss";
import theme from "./theme";
import fonts from "./fonts";

console.log("🍪");
const bootstrap = async () => {
  console.log(theme, "theme");

  WebFont.load({
    google: {
      families: fonts,
    },
  });
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>,
    document.getElementById("root")
  );
};

bootstrap();
reportWebVitals();