import { AccountCircle, Home, Logout, Leaderboard, CurrencyExchange} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Menu, Toolbar, Typography, MenuItem, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../SupabaseClient';

function DashboardLayout({ children, profile }) {
    const navigate = useNavigate();
    const [anchorUserMenu, setAnchorUserMenu] = useState(null);

    const handleProfileMenuOpen = (event) => {
        setAnchorUserMenu(event.currentTarget);
    };

    const handleProfileClose = () => {
        setAnchorUserMenu(null);
    };
    const handleSignout = async () => {
        // Handle sign out logic here
        await supabase.auth.signOut()
            .then(() => {
                navigate('/'); // Redirect to AuthPage after sign out
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
        // Close the profile menu after sign out
        handleProfileClose();
    }
    const handleOpenSettings = () => {
        navigate('/settings');
    }
    const profileToggle = (event) => {
        // Logic to toggle the profile menu
        if (anchorUserMenu) {
            handleProfileClose();
        } else {
            handleProfileMenuOpen(event);
        }
    }
    // Render the dashboard layout with an AppBar and a main content area

    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        // Prevent toggle on tab or shift key press
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // State for menu icon animation
    const [menuIconToggled, setMenuIconToggled] = useState(false);

    // Handle drawer open/close and icon animation
    const handleDrawerToggle = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
        setMenuIconToggled(open);
    };

    return (
        <div>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            edge="start"
                            size="large"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerToggle(!drawerOpen)}
                            sx={{ ml: { xs: 1, sm: 3, md: 5 }, mr: 2 }}
                        >
                            <Box
                                sx={{
                                    width: 28,
                                    height: 28,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                }}
                            >
                                {/* Animated Hamburger/X */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: 24,
                                        height: 2,
                                        bgcolor: 'currentColor',
                                        borderRadius: 1,
                                        transition: 'transform 0.3s, opacity 0.3s',
                                        transform: menuIconToggled
                                            ? 'rotate(45deg) translateY(0px)'
                                            : 'rotate(0deg) translateY(-7px)',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: 24,
                                        height: 2,
                                        bgcolor: 'currentColor',
                                        borderRadius: 1,
                                        transition: 'opacity 0.3s',
                                        opacity: menuIconToggled ? 0 : 1,
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: 24,
                                        height: 2,
                                        bgcolor: 'currentColor',
                                        borderRadius: 1,
                                        transition: 'transform 0.3s, opacity 0.3s',
                                        transform: menuIconToggled
                                            ? 'rotate(-45deg) translateY(0px)'
                                            : 'rotate(0deg) translateY(7px)',
                                    }}
                                />
                            </Box>
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600 }}
                        >
                            Dashboard
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Spirit Dollars Display */}
                        <Box
                            sx={{
                                display: { xs: 'none', sm: 'flex' },
                                alignItems: 'center',
                                bgcolor: 'rgba(255,255,255,0.08)',
                                borderRadius: 2,
                                px: 2,
                                py: 0.5,
                                mr: { xs: 0, sm: 2 },
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 500, color: 'primary.contrastText', mr: 1 }}
                            >
                                Spirit Dollars:
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 700, color: 'primary.contrastText' }}
                            >
                                100
                            </Typography>
                        </Box>
                        {/* On xs screens, show a compact version */}
                        <Box
                            sx={{
                                display: { xs: 'flex', sm: 'none' },
                                alignItems: 'center',
                                bgcolor: 'rgba(255,255,255,0.08)',
                                borderRadius: 2,
                                px: 1.2,
                                py: 0.3,
                                mr: 1,
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 500, color: 'primary.contrastText', mr: 0.5 }}
                            >
                                $
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 700, color: 'primary.contrastText' }}
                            >
                                100
                            </Typography>
                        </Box>
                        <IconButton
                            size="large"
                            aria-label="account of user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            onClick={profileToggle}
                        >
                            <AccountCircle sx={{ mr: 1 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{ display: { xs: 'none', md: 'flex' } }}
                            >
                                UserName
                            </Typography>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorUserMenu}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorUserMenu)}
                            onClose={handleProfileClose}
                        >
                            <MenuItem onClick={handleSignout}>
                                <Logout />
                                <Typography sx={{ textAlign: 'center' }}>Log Out</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleOpenSettings}>
                                <Typography sx={{ textAlign: 'center' }}>Settings</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle(false)}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    zIndex: (theme) => theme.zIndex.appBar - 1,
                    '& .MuiDrawer-paper': {
                        top: '64px',
                        height: 'calc(100% - 64px)',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: (theme) => theme.palette.background.default,
                    },
                    '@media (max-width:600px)': {
                        '& .MuiDrawer-paper': {
                            top: '56px',
                            height: 'calc(100% - 56px)',
                        }
                    }
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                    }}
                    role="presentation"
                    onClick={handleDrawerToggle(false)}
                    onKeyDown={handleDrawerToggle(false)}
                >
                    <List sx={{ width: '100%' }}>
                        <ListItem component="button" sx={{ justifyContent: 'center' }} onClick={() => navigate('/dashboard')}>
                            <ListItemIcon sx={{ minWidth: 0, mr: 1, justifyContent: 'center' }}>
                                <Home />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" sx={{ textAlign: 'center' }} />
                        </ListItem>
                        <ListItem component="button" sx={{ justifyContent: 'center' }} onClick={() => navigate('/bets')}>
                            <ListItemIcon sx={{ minWidth: 0, mr: 1, justifyContent: 'center' }}>
                                <CurrencyExchange />
                            </ListItemIcon>
                            <ListItemText primary="Bets" sx={{ textAlign: 'center' }} />
                        </ListItem>
                        <ListItem component="button" sx={{ justifyContent: 'center' }} onClick={() => navigate('/leaderboard')}>
                            <ListItemIcon sx={{ minWidth: 0, mr: 1, justifyContent: 'center' }}>
                                <Leaderboard />
                            </ListItemIcon>
                            <ListItemText primary="Leaderboard" sx={{ textAlign: 'center' }} />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Toolbar /> {/* Spacer for fixed AppBar */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {React.Children.map(children, child =>
                    React.cloneElement(child, { profile: profile })
                )}
            </Box>
        </div>
    )
}

export default DashboardLayout;