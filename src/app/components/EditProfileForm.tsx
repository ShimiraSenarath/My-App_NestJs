'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Button, InputLabel, MenuItem, Select, TextField, Typography,
    FormHelperText, FormControl, Tabs, Tab, Avatar, IconButton, useMediaQuery, useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import styles from './EditProfileForm.module.scss';
import Link from 'next/link';


interface ProfileFormData {
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
}

const schema = yup.object().shape({
    salutation: yup.string().required('Salutation is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email().required('Email is required'),
    postalCode: yup.string().required('Postal code is required'),
    dob: yup
        .string()
        .required('Date of birth is required')
        .test('age', 'You must be at least 17 years old', function (value) {
            const today = new Date();
            const dob = new Date(value ?? '');
            const age = today.getFullYear() - dob.getFullYear();
            return age >= 17;
        }),
});

export default function ProfileFormTabs() {
    const methods = useForm<ProfileFormData>({
        resolver: yupResolver(schema),
        defaultValues: {},
        mode: 'onChange',
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid  },
    } = methods;

    const maritalStatus = useWatch({ control, name: 'maritalStatus' });
    const [tab, setTab] = useState(0);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(true);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                const data = await res.json();

                if (res.ok && data?.profile) {
                    methods.reset(data.profile);
                }
            } catch (err) {
                console.error('Failed to fetch profile data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }


    const onSubmit = async (data: ProfileFormData) => {

        try {
            const formData = new FormData();
            // Append form data
            for (const key in data) {
                if (data[key as keyof ProfileFormData]) {
                    formData.append(key, data[key as keyof ProfileFormData] as string);
                }
            }

            // Append file
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const res = await fetch('/api/profile', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const result = await res.json();
            if (result.success) {
                alert('Profile saved successfully!');
                setTab((prev) => Math.min(prev + 1, 3));
            } else {
                alert('Failed to save profile.');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong.');
        }
    };


    return (
        <FormProvider {...methods}>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: '100%',
                }}
                className="profileContainer"
            >

                <Box className={styles.sidebarTabs}>
                    <Tabs value={tab}
                        onChange={(e, newVal) => setTab(newVal)}
                        orientation={isSmallScreen ? 'horizontal' : 'vertical'}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ mb: 3 }}  >
                        <Tab label="Basic Details" />
                        <Tab label="Additional Details" />
                        {maritalStatus === 'Married' && <Tab label="Spouse Details" />}
                        <Tab label="Personal Preferences" />
                    </Tabs>
                </Box>

                <Box sx={{ flex: 1, pl: { xs: 0, sm: 4 }, flexDirection: { xs: 'column', sm: 'column' }, width: '100%' }}>
                    <div className={styles.profileHeader}>

                        <h1>
                            Edit <strong>Profile</strong>
                            <span className={styles.line} ></span>
                        </h1>
                        <Link href="/profile" className={styles.backLink}>
                            ← Go back to My Profile
                        </Link>
                    </div>

                    {tab === 0 && (
                        <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', sm: 'column' }, width: '100%' }}>
                            <Grid size={{ xs: 6, sm: 4 }} component="div" className={styles.avatarSection}>

                                <Avatar
                                    sx={{ width: 100, height: 100, mx: 'auto' }}
                                    src={avatarPreview || undefined}
                                />
                                <IconButton component="label" sx={{ mt: 1, display: 'block', mx: 'auto' }}>
                                    <PhotoCamera />
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setAvatarFile(file);
                                                setAvatarPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </IconButton>


                                <Typography align="center" variant="body2" className={styles.uploadLabel}>
                                    Upload image
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 12, lg: 6 }} component="div" className={styles.formSection}>
                                <FormControl fullWidth error={!!errors.salutation} margin="normal">
                                    <InputLabel>Salutation</InputLabel>
                                    <Select {...register('salutation')} defaultValue="">
                                        <MenuItem value=""><em>-- Select --</em></MenuItem>
                                        <MenuItem value="Mr.">Mr.</MenuItem>
                                        <MenuItem value="Ms.">Ms.</MenuItem>
                                        <MenuItem value="Mrs.">Mrs.</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.salutation?.message}</FormHelperText>
                                </FormControl>

                                <TextField
                                    label="First Name"
                                    fullWidth
                                    {...register('firstName')}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                    margin="normal"
                                />
                                <TextField
                                    label="Last Name"
                                    fullWidth
                                    {...register('lastName')}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                    margin="normal"
                                />
                                <TextField
                                    label="Email Address"
                                    fullWidth
                                    {...register('email')}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                    )}

                    {tab === 1 && (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6, sm: 12, lg: 6  }} component="div" className={styles.formSection}>
                                <TextField label="Home Address" fullWidth {...register('homeAddress')} margin="normal" />
                                <TextField label="Country" fullWidth {...register('country')} margin="normal" />
                                <TextField
                                    label="Postal Code"
                                    fullWidth
                                    {...register('postalCode')}
                                    error={!!errors.postalCode}
                                    helperText={errors.postalCode?.message}
                                    margin="normal"
                                />
                                <TextField
                                    label="Date of Birth"
                                    type="date"
                                    fullWidth
                                    {...register('dob')}
                                    error={!!errors.dob}
                                    helperText={errors.dob?.message}
                                    InputLabelProps={{ shrink: true }}
                                    margin="normal"
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Gender</InputLabel>
                                    <Select {...register('gender')} defaultValue="">
                                        <MenuItem value=""><em>-- Select --</em></MenuItem>
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Marital Status</InputLabel>
                                    <Select {...register('maritalStatus')} defaultValue="">
                                        <MenuItem value=""><em>-- Select --</em></MenuItem>
                                        <MenuItem value="Single">Single</MenuItem>
                                        <MenuItem value="Married">Married</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}

                    {tab === 2 && maritalStatus === 'Married' && (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6, sm: 12, lg: 6 }} component="div" className={styles.formSection}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Spouse Salutation</InputLabel>
                                    <Select {...register('spouseSalutation')} defaultValue="">
                                        <MenuItem value=""><em>-- Select --</em></MenuItem>
                                        <MenuItem value="Mr.">Mr.</MenuItem>
                                        <MenuItem value="Ms.">Ms.</MenuItem>
                                        <MenuItem value="Mrs.">Mrs.</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField label="Spouse First Name" fullWidth {...register('spouseFirstName')} margin="normal" />
                                <TextField label="Spouse Last Name" fullWidth {...register('spouseLastName')} margin="normal" />
                            </Grid>
                        </Grid>
                    )}

                    {(tab === 3 || (tab === 2 && maritalStatus !== 'Married')) && (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6, sm: 12, lg: 6  }} component="div" className={styles.formSection}>
                                <TextField label="Hobbies" fullWidth {...register('hobbies')} margin="normal" />
                                <TextField label="Favorite Sports" fullWidth {...register('sports')} margin="normal" />
                                <TextField label="Preferred Music Genres" fullWidth {...register('music')} margin="normal" />
                                <TextField label="Preferred Movies/TV Shows" fullWidth {...register('movies')} margin="normal" />
                            </Grid>
                        </Grid>
                    )}

                    <Box  sx={{ display: 'flex', gap: 2, mt: 4, width: { xs: '50%', sm: '100%' } }} className={styles.buttonGroup}>
                        <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                            Save & Update
                        </Button>
                        <Button variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </Box>
                </Box>

            </Box>
        </FormProvider>
    );
}
