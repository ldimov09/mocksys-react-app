import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InstallButton from './InstallButton';
import { useAlert } from '../contexts/AlertContext';

export default function Navbar() {
    const { showAlert } = useAlert();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // md = 960px breakpoint

    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        showAlert('Logout successful!', 'success');
        navigate('/login');
        setDrawerOpen(false);
    };

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    // Drawer menu items
    const menuItems = [
        !user && { text: 'Register Full', to: '/register/full' },
        !user && { text: 'Login', to: '/login' },
        user && { text: 'Dashboard', to: '/' },
        user && user?.role == "business" && { text: 'Items', to: '/items' },
        user && user?.role == "business" && { text: 'Devices', to: '/devices' },
        user && { text: 'Logout', action: handleLogout },
    ].filter(Boolean); // remove falsey entries

    const drawerList = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Box
                sx={{
                    backgroundColor: 'primary.main', // theme primary color
                    color: 'primary.contrastText',  // automatically picks readable text color
                    p: 2,
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6">
                    Mocksys
                </Typography>
            </Box>
            <List>
                {menuItems.map(({ text, to, action, disabled }, index) => (
                    <ListItem key={index} disablePadding>
                        {to ? (
                            <ListItemButton component={Link} to={to} disabled={disabled} sx={{ textTransform: 'uppercase' }}>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        ) : (
                            <ListItemButton onClick={action} disabled={disabled} sx={{ color: 'inherit' }}>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {isSmallScreen && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Mocksys
                    </Typography>

                    <InstallButton />

                    {!isSmallScreen && !user && ( <>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/register/full">
                            Register Full
                        </Button>
                    </> )}

                    {!isSmallScreen && user && (
                        <>
                            <Button color="inherit" component={Link} to="/">
                                Dashboard
                            </Button>
                            {user.role == "business" ? (
                                <>
                                    <Button color="inherit" component={Link} to="/items">
                                        Items
                                    </Button>
                                    <Button color="inherit" component={Link} to="/devices">
                                        Devices
                                    </Button>
                                </>
                            ): <></>}
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerList}
            </Drawer>
        </>
    );
}
