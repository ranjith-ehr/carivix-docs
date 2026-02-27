import { supabase } from '../lib/supabase';
import { userService } from './userService';

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    joinedDate: string;
    company?: string;
    title?: string;
    location?: {
        lat: number;
        lng: number;
    };
}

export const authService = {
    signup: async (name: string, email: string, password: string, location?: { lat: number; lng: number }): Promise<User> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    company: 'Acme Corporation', // Default
                    title: 'Data Analyst', // Default
                    location: location
                },
            },
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error('Signup successful but no user data returned');

        // Record the initial login/signup location in history
        if (location) {
            await userService.recordLogin(data.user.id, location);
        }

        return {
            id: data.user.id,
            name: data.user.user_metadata.name || name,
            email: data.user.email || email,
            joinedDate: data.user.created_at,
            company: data.user.user_metadata.company,
            title: data.user.user_metadata.title,
            location: data.user.user_metadata.location
        };
    },

    login: async (email: string, password: string, location?: { lat: number; lng: number }): Promise<User> => {
        // Update user metadata with current location on every login
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error('Login successful but no user data returned');

        // Update identity metadata with the latest location
        if (location) {
            await supabase.auth.updateUser({
                data: { location }
            });
            // Record login location in dedicated history table
            await userService.recordLogin(data.user.id, location);
        }

        return {
            id: data.user.id,
            name: data.user.user_metadata.name || 'User',
            email: data.user.email || email,
            joinedDate: data.user.created_at,
            company: data.user.user_metadata.company,
            title: data.user.user_metadata.title,
            location: location || data.user.user_metadata.location
        };
    },

    logout: async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    },

    getCurrentUser: async (): Promise<User | null> => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) return null;

        const user = session.user;
        return {
            id: user.id,
            name: user.user_metadata.name || 'User',
            email: user.email || '',
            joinedDate: user.created_at,
            company: user.user_metadata.company,
            title: user.user_metadata.title,
            location: user.user_metadata.location,
        };
    },

    updateProfile: async (updates: Partial<User>): Promise<User> => {
        const { data, error } = await supabase.auth.updateUser({
            data: {
                name: updates.name,
                company: updates.company,
                title: updates.title,
                location: updates.location
            },
            email: updates.email
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error('Update failed');

        return {
            id: data.user.id,
            name: data.user.user_metadata.name || 'User',
            email: data.user.email || '',
            joinedDate: data.user.created_at,
            company: data.user.user_metadata.company,
            title: data.user.user_metadata.title,
            location: data.user.user_metadata.location
        };
    },

    deleteAccount: async (): Promise<void> => {
        // In a real app, this would call a server-side function to delete user data
        // For this demo, we'll just sign out the user
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    },

    signOutAll: async (): Promise<void> => {
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) throw new Error(error.message);
    }
};
