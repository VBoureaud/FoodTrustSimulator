import React from "react";
import { config } from "@config";

import { Link } from "react-router-dom";
import ResponsiveAppBar from "./ResponsiveAppBar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import './Template.less';

import {
  User,
} from '@store/types/UserTypes';

export const Footer = (props: any) => {
  return (
    <Box color="white" {...props} sx={{ position: 'relative', zIndex: 2, marginTop: '32px', marginBottom: 0, paddingBottom: '32px'}}>
      <Typography align="center" variant="body2">
        Developed and designed by <a href="https://github.com/VBoureaud/">@VBoureaud</a>
      </Typography>
      <Typography align="center" variant="body2">
        Illustrated by <a href="https://instagram.com/domicercle">@domicercle</a>
      </Typography>
      <Typography align="center" variant="body2">
        v{config.version}
      </Typography>
    </Box>
  );
}

type TemplateType = {
  children: any;
  isLogged: boolean;
  logout?: Function;
  noContainer?: boolean;
  className?: string;
  user?: User;
}

const Template : React.FunctionComponent<TemplateType> = (props) => {
  return (
    <div className={props.className ? props.className : "background"}>
      <ResponsiveAppBar
        isLogged={props.isLogged}
        logout={props.logout}
        user={props.user}
      />
      {!props.noContainer && <Container maxWidth="lg" sx={{ mt: 5 }}>
        {props.children}
      </Container>}
      {props.noContainer && props.children}
      <Footer sx={{ mt: 8, mb: 4 }} />
    </div>);
}

export default Template;
