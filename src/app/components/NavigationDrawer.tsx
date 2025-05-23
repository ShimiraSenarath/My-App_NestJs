'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Box } from '@mui/material';

export default function NavigationDrawer() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login'); 
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const menuItems = [
    { label: 'Home', href: '/home' },
    { label: 'My Profile', href: '/profile' },
    { label: 'Edit Profile', href: '/edit-profile' },
  ];

  return (
    <>
      {/* Hamburger Icon */}
      <IconButton
        onClick={() => setOpen(prev => !prev)}
        sx={{
          position: 'absolute',
          top: 5,
          left: 16,
          zIndex: 1301,
          color: 'black',
        }}
        aria-label="Open navigation menu"
        size="large"
      >
        <MenuIcon fontSize="inherit" />
      </IconButton>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 220,
            boxShadow: 3,
            borderRadius: '0 16px 16px 0',
            background: '#fff',
            paddingTop: 2,
          },
        }}
      >
        <Box sx={{ mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.label} disablePadding >
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <ListItemText primary={item.label}/>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
