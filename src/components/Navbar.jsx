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
    useMediaQuery,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InstallButton from './InstallButton';
import { useAlert } from '../contexts/AlertContext';
import { useTranslations } from '../contexts/TranslationContext';

export default function Navbar() {
    const { showAlert } = useAlert();
    const { user, logout } = useAuth();
    const { locale, setLocale } = useTranslations();
    const navigate = useNavigate();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // md = 960px breakpoint

    const [drawerOpen, setDrawerOpen] = useState(false);
    const { t } = useTranslations();

    const handleLogout = () => {
        logout();
        showAlert('Logout successful!', 'success');
        navigate('/login');
        setDrawerOpen(false);
    };

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const menuItems = [
        !user && { text: t('navbar.register_full'), to: '/register/full' },
        !user && { text: t('navbar.login'), to: '/login' },
        user && { text: t('navbar.dashboard'), to: '/' },
        user && { text: t('navbar.transfers'), to: '/transfers' },
        user && user?.role === "business" && { text: t('navbar.items'), to: '/items' },
        user && user?.role === "business" && { text: t('navbar.devices'), to: '/devices' },
        user && { text: t('navbar.logout'), action: handleLogout },
    ].filter(Boolean);

    const drawerList = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Box
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    p: 2,
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6">Mocksys</Typography>
            </Box>
            <List>
                {menuItems.map(({ text, to, action, disabled }, index) => (
                    <ListItem key={index} disablePadding>
                        {to ? (
                            <ListItemButton component={Link} to={to} disabled={disabled} sx={{ textTransform: 'uppercase' }}>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        ) : (
                            <ListItemButton onClick={action} disabled={disabled} sx={{ color: 'inherit', textTransform: 'uppercase' }}>
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

                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Mocksys</Typography>

                    <InstallButton />

                    {!isSmallScreen && !user && (
                        <>
                            <Button color="inherit" component={Link} to="/login" sx={{ textTransform: "uppercase" }}>
                                {t('navbar.login')}
                            </Button>
                            <Button color="inherit" component={Link} to="/register/full">
                                {t('navbar.register_full')}
                            </Button>
                        </>
                    )}

                    {!isSmallScreen && user && (
                        <>
                            <Button color="inherit" component={Link} to="/">
                                {t('navbar.dashboard')}
                            </Button>
                            <Button color="inherit" component={Link} to="/transfers">
                                {t('navbar.transfers')}
                            </Button>
                            {user.role === "business" && (
                                <>
                                    <Button color="inherit" component={Link} to="/items">
                                        {t('navbar.items')}
                                    </Button>
                                    <Button color="inherit" component={Link} to="/devices">
                                        {t('navbar.devices')}
                                    </Button>
                                </>
                            )}
                            <Button color="inherit" onClick={handleLogout} sx={{ textTransform: "uppercase" }}>
                                {t('navbar.logout')}
                            </Button>
                        </>
                    )}

                    {
                        locale == "en" ? (
                            <Button value="bg" aria-label="BG" onClick={(e) => setLocale('bg')}>
                                <img src="/flag-bg-250.png" alt="BG" width={32} />
                            </Button>
                        ) : (
                            <Button value="en" aria-label="EN" onClick={(e) => setLocale('en')}>
                                <img src="/flag-us.png" alt="EN" width={32} />
                            </Button>
                        )
                    }
                </Toolbar >
            </AppBar >

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerList}
            </Drawer>
        </>
    );
}
