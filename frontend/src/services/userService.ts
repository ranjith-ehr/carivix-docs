import { supabase } from '../lib/supabase';

export interface LoginRecord {
    id: string;
    user_id: string;
    login_at: string;
    lat: number;
    lng: number;
}

export const userService = {
    /**
     * Records a user's login time and location in the database history.
     */
    async recordLogin(userId: string, location: { lat: number; lng: number }): Promise<void> {
        const { error } = await supabase
            .from('login_history')
            .insert([
                {
                    user_id: userId,
                    login_at: new Date().toISOString(),
                    lat: location.lat,
                    lng: location.lng
                }
            ]);

        if (error) {
            console.error('Error recording login history:', error);
            // We don't throw error here to avoid blocking the user's login experience
            // if just the logging fails.
        }
    },

    /**
     * Fetches the login history for a specific user.
     */
    async getLoginHistory(userId: string): Promise<LoginRecord[]> {
        const { data, error } = await supabase
            .from('login_history')
            .select('*')
            .eq('user_id', userId)
            .order('login_at', { ascending: false });

        if (error) {
            console.error('Error fetching login history:', error);
            return [];
        }

        return data || [];
    }
};
