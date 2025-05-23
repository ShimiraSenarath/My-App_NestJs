'use client';

import React, { useEffect, useState } from 'react';
import styles from './EditProfileForm.module.scss';
import { Box, Tabs, Tab, Avatar, Typography, Grid, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';

type ProfileType = {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  homeAddress?: string;
  country?: string;
  postalCode: string;
  dob: string;
  gender?: string;
  maritalStatus?: string;
  spouseSalutation?: string;
  spouseFirstName?: string;
  spouseLastName?: string;
  hobbies?: string;
  sports?: string;
  music?: string;
  movies?: string;
  avatar?: string;
};

const tabs = [
  "Basic Details",
  "Additional Details",
  "Spouse Details",
  "Personal Preferences"
];

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' });
        const data = await res.json();
        setProfile(data.profile);
      } catch (err) {
        console.log(err);

        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found.</div>;

  // Only show Spouse Details tab if married
  const visibleTabs = tabs.filter(
    (tab) => tab !== "Spouse Details" || profile.maritalStatus === "Married"
  );

  const initials = profile.firstName && profile.lastName ? profile.firstName[0] + profile.lastName[0] : '?';
  const avatarSrc = profile.avatar || undefined;

  return (
    <Box className={styles.profileContainer} sx={{
      display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
      height: '100%',
    }}>
      {/* Sidebar Tabs */}
      <Box className={styles.sidebarTabs}
        sx={{
          borderRight: { sm: '1px solid #ccc' },
          width: { xs: '100%', sm: 220 },
          mb: { xs: 2, sm: 0 },
        }}>

        <Tabs
          value={activeTab}
          onChange={(_, idx) => setActiveTab(idx)}
          orientation={isSmallScreen ? 'horizontal' : 'vertical'}
          variant="scrollable"
          scrollButtons="auto"
        >
          {visibleTabs.map((tab) => (
            <Tab key={tab} label={tab} />
          ))}
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, pl: { xs: 0, sm: 4 } }}>
        <div className={styles.profileHeader}>
          <h1>
            My <strong>Profile</strong>
            <span className={styles.line}></span>
          </h1>
          <Link href="/edit-profile" className={styles.backLink}>
            Edit profile <span>✎</span>
          </Link>
        </div>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', sm: 'column', lg: 'row' }, width: '100%' }}>
            <Grid size={{ xs: 6, sm: 4 }} component="div" className={styles.avatarSection}>
              
              <Avatar
                src={avatarSrc}
                alt={`${profile.firstName} ${profile.lastName}`}
                sx={{ width: 80, height: 80, mx: { xs: 'auto', sm: 'initial' } }}
              >
                {!avatarSrc && initials}
              </Avatar>
              <Typography align="center" variant="body2" className={styles.uploadLabel}>
                Profile image
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 12, lg: 6 }} component="div" className={styles.formSection}>
              <Typography><strong>Salutation</strong><br />{profile.salutation}</Typography>
              <Typography><strong>First Name</strong><br />{profile.firstName}</Typography>
              <Typography><strong>Last Name</strong><br />{profile.lastName}</Typography>
              <Typography><strong>Email Address</strong><br />{profile.email}</Typography>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 12, lg: 6 }} component="div" className={styles.formSection}>
              <Typography><strong>Home Address</strong><br />{profile.homeAddress || '—'}</Typography>
              <Typography><strong>Country</strong><br />{profile.country || '—'}</Typography>
              <Typography><strong>Postal Code</strong><br />{profile.postalCode}</Typography>
              <Typography><strong>Date of Birth</strong><br />{profile.dob}</Typography>
              <Typography><strong>Gender</strong><br />{profile.gender || '—'}</Typography>
              <Typography><strong>Marital Status</strong><br />{profile.maritalStatus || '—'}</Typography>
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && profile.maritalStatus === "Married" && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 12, lg: 6 }} component="div" className={styles.formSection}>
              <Typography><strong>Spouse Salutation</strong><br />{profile.spouseSalutation || '—'}</Typography>
              <Typography><strong>Spouse First Name</strong><br />{profile.spouseFirstName || '—'}</Typography>
              <Typography><strong>Spouse Last Name</strong><br />{profile.spouseLastName || '—'}</Typography>
            </Grid>
          </Grid>
        )}

        {(activeTab === 3 || (activeTab === 2 && profile.maritalStatus !== "Married")) && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 12, lg: 6 }} component="div" className={styles.formSection}>
              <Typography><strong>Hobbies</strong><br />{profile.hobbies || '—'}</Typography>
              <Typography><strong>Favorite Sports</strong><br />{profile.sports || '—'}</Typography>
              <Typography><strong>Preferred Music Genres</strong><br />{profile.music || '—'}</Typography>
              <Typography><strong>Preferred Movies/TV Shows</strong><br />{profile.movies || '—'}</Typography>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
