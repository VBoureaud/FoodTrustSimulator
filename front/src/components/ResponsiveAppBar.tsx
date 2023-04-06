import * as React from 'react';
import { Link } from "react-router-dom";
import { navBarTabs, navBarUserSettings, configOnChain } from "@config";

import logo from '@assets/images/logo.png';
import './ResponsiveAppBar.less';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import {
  nameTypeToken,
} from '@utils/gameEngine';
import { 
  unPad,
} from "@utils/helpers";

import {
  User,
} from '@store/types/UserTypes';

interface ResponsiveAppBar {
  isLogged?: boolean;
  logout?: Function;
  user?: User;
  type?: string;
}

const ResponsiveAppBar = (props: ResponsiveAppBar) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar id="navBar" position="relative">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ position: 'relative', justifyContent: 'space-between' }}>
          {/* on desktop view */}
          <Box sx={{ position: 'relative', display: { xs: 'none', md: 'flex' }}}>
            <Link to='/'>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ mr: 2 }}
              >
                <img src={logo} alt={logo} width='40' height='40' />
                <span style={{ 
                    fontSize: '12px',
                    color: '#ffef00',
                    position: 'absolute',
                    bottom: '32px',
                    left: '38px',
                  }}>Beta</span>
              </Typography>
            </Link>
          </Box>

          {/* on desktop view */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navBarTabs.filter(elt => elt.requireAuth ? props.isLogged : true).map((page) => (
              <Link to={page.path} key={page.name}>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>

          {/* on mobile view */}
          <Box sx={{ zIndex: '1', display: { xs: props.isLogged ? 'flex' : 'none', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {navBarTabs.filter(elt => elt.requireAuth ? props.isLogged : true).map((page) => (
                <Link to={page.path} key={page.name}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>

          {/* on mobile view - logo absolute */}
          <Box sx={{ 
            justifyContent: 'center',
            display: { xs: 'flex', md: 'none' },
            position: 'absolute',
            top: '3px',
            left: '0',
            right: '0',
            zIndex: '0',
          }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
            >
              <Link to='/'>
                <img src={logo} alt={logo} width='50' height='50' />
                <span style={{ 
                  fontSize: '12px',
                  color: '#ffef00',
                  position: 'relative',
                  bottom: '35px',
                  left: '-3px'
                }}>Beta</span>
              </Link>
            </Typography>
          </Box>

          {/* on mobile view & desktop */}
          {props.isLogged && <Box sx={{ zIndex: '1', display: 'flex', justifyContent: 'right', alignItems: 'center', flexDirection: 'row-reverse' }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ height: '35px', width: '35px', p: 0 }}>
                <Box className="avatarNavbarContainer">
                  <Box className={"avatarNavbar" + " type_"+ (props.user ? props.user.type : '') + "_navbar"}></Box>
                </Box>
              </IconButton>
            </Tooltip>
            {props.user && 
              <Box sx={{ textAlign: 'right', marginRight: '5px', display: { xs: 'none', sm: 'block' } }}>
                <Tooltip title={props.user.address} placement="top-start">
                  <Typography sx={{ fontSize: '15px' }}>{props.user.name}</Typography>
                </Tooltip>
                {props.user.server && <Tooltip title={configOnChain.filter(e => e.name === props.user.server)[0].url} placement="top-start">
                   <Typography sx={{ 
                    color: configOnChain.filter(e => e.name === props.user.server)[0].color,
                    fontSize: '12px',
                  }}>
                    {props.user.server}
                  </Typography>
                </Tooltip>}
              </Box>}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar-profil"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {navBarUserSettings.map((setting) => (
                <Link
                  key={setting.name}
                  to={setting.link}
                  onClick={
                    () => setting && setting.name && setting.name.toLocaleLowerCase() == 'logout' ? props.logout() : {}
                  }>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography sx={{ color: 'white', padding: '5px 0', textTransform: 'uppercase' }} textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                </Link>
              ))}
              {props.user && props.user.quest && <Box sx={{ maxWidth: '180px', background: '#222', textAlign: 'center', p: 2 }}>
                <Typography sx={{ color: 'white', fontSize: '12px' }}>QUEST</Typography>
                <Box sx={{ display: 'flex' }}>
                   {props.user.quest[0].tokenNeeded.map((e: string, index: number) => 
                      <Tooltip
                        key={index}
                        title={nameTypeToken[e] ? nameTypeToken[e].name.replace(/^\w/, (c: string) => c.toUpperCase()).replace('_', ' ') : 'Unknown'} placement="top-start">
                          <Box
                            className={"nftTokenMin minType"+ unPad(e)}
                          ></Box>
                      </Tooltip>
                    )}
                </Box>
              </Box>}
            </Menu>
          </Box>}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;