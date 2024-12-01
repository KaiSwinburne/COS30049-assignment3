import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AdbIcon from '@mui/icons-material/Adb';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png'

const pages = ['Predictions', 'Weather', 'About'];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        
          {/* The Logo container with a link to Home page */}
          <Box
            component={Link}
            to="/"  //to Home Page
            sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 2,
              textDecoration: 'none'
            }}
          >
              <Box 
              component="img"
              href="#app-bar-with-responsive-menu"
              sx={{
                height: 50, 
                display: { xs: 'none', md: 'flex' },
                mr: 2,
              }}
              alt="Company Logo"
              src={Logo} 
              />
          </Box>

          {/* The resized elements */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography 
                    sx={{ textAlign: 'center' }}
                    component={Link}
                    to={`/${page.toLowerCase()}`}
                    >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* The resized elements */}
         <Box
            component={Link}
            to="/"  //to Home Page
            sx={{
              display: { xs: 'flex', md: 'none' },
              mx: 'auto',
              textDecoration: 'none'
            }}
          >
            <Box 
            component="img"
            href="#app-bar-with-responsive-menu"
            sx={{
              height: 50, 
              display: { xs: 'flex', md: 'none' },
              mr: 2,
            }}
            alt="Company Logo"
            src={Logo} 
            />
          </Box>

          {/* Normal elements */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                component={Link}
                to={`/${page.toLowerCase()}`}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Button 
            size="medium" 
            sx={{color:'#ffffff'}} 
            component={Link}
            to='/signin'
            >
              Login
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;