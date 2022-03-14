import React from "react";

import ResponsiveAppBar from "./ResponsiveAppBar";
import Container from "@mui/material/Container";

type TemplateType = {
  children: any;
  isLogged: boolean;
  logout?: Function;
  noContainer?: boolean;
}

import './Template.less';

const Template : React.FunctionComponent<TemplateType> = (props) => {
  return (
    <div className="background">
      <ResponsiveAppBar
        isLogged={props.isLogged}
        logout={props.logout}
      />
      {!props.noContainer && <Container maxWidth="lg" sx={{ mt: 5 }}>
        {props.children}
      </Container>}
      {props.noContainer && props.children}
    </div>);
}

export default Template;
