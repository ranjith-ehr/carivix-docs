import { supabase } from '../lib/supabase';

export interface Message {
    id: string;
    chat_id: string;
    text: string;
    is_user: boolean;
    timestamp: Date;
    attachment?: {
        name: string;
        type: string;
        url?: string;
    };
    chartData?: any[];
    chartType?: string;
    chartTitle?: string;
    analysis?: string;
}

export interface Chat {
    id: string;
    user_id: string;
    title: string;
    lastMessage?: string;
    created_at: string;
}

export const chatService = {
    async getChats(): Promise<Chat[]> {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return [];

        const { data, error } = await supabase
            .from('chats')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching chats:', error);
            return [];
        }

        return data || [];
    },

    async createChat(title: string): Promise<Chat | null> {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        const { data, error } = await supabase
            .from('chats')
            .insert([
                { user_id: session.user.id, title }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating chat:', error);
            return null;
        }

        return data;
    },

    async updateChat(chatId: string, title: string): Promise<boolean> {
        const { error } = await supabase
            .from('chats')
            .update({ title })
            .eq('id', chatId);

        if (error) {
            console.error('Error updating chat:', error);
            return false;
        }
        return true;
    },

    async getMessages(chatId: string): Promise<Message[]> {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('timestamp', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
            return [];
        }

        return (data || []).map(m => ({
            ...m,
            timestamp: new Date(m.timestamp),
            chartData: m.chart_data,
            chartType: m.chart_type,
            chartTitle: m.chart_title
        }));
    },

    async sendMessage(chatId: string, message: Partial<Message>): Promise<Message | null> {
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    chat_id: chatId,
                    text: message.text,
                    is_user: message.is_user,
                    attachment: message.attachment,
                    chart_data: message.chartData,
                    chart_type: message.chartType,
                    chart_title: message.chartTitle,
                    analysis: message.analysis,
                    timestamp: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error sending message:', error);
            return null;
        }

        return {
            ...data,
            timestamp: new Date(data.timestamp),
            chartData: data.chart_data,
            chartType: data.chart_type,
            chartTitle: data.chart_title
        };
    },

    async updateMessage(messageId: string, updates: Partial<Message>): Promise<boolean> {
        const { error } = await supabase
            .from('messages')
            .update({
                text: updates.text,
                chart_title: updates.chartTitle,
                chart_data: updates.chartData,
                analysis: updates.analysis
            })
            .eq('id', messageId);

        if (error) {
            console.error('Error updating message:', error);
            return false;
        }
        return true;
    },

    async deleteChat(chatId: string): Promise<boolean> {
        // Delete all messages in this chat first
        const { error: msgError } = await supabase
            .from('messages')
            .delete()
            .eq('chat_id', chatId);

        if (msgError) {
            console.error('Error deleting messages:', msgError);
            return false;
        }

        // Delete the chat itself
        const { error } = await supabase
            .from('chats')
            .delete()
            .eq('id', chatId);

        if (error) {
            console.error('Error deleting chat:', error);
            return false;
        }
        return true;
    },

    async getUserStats(): Promise<{ analyses: number; files: number; uptime: string }> {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return { analyses: 0, files: 0, uptime: '0%' };

        // Get all chats for this user
        const { data: chats } = await supabase
            .from('chats')
            .select('id')
            .eq('user_id', session.user.id);

        const chatIds = (chats || []).map(c => c.id);
        let analysesCount = 0;
        let filesCount = 0;

        if (chatIds.length > 0) {
            // Count messages (Analyses Run = AI responses)
            const { count } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .in('chat_id', chatIds)
                .eq('is_user', false);
            analysesCount = count || 0;

            // Count attachments
            const { data: messagesWithAttachments } = await supabase
                .from('messages')
                .select('attachment')
                .in('chat_id', chatIds)
                .not('attachment', 'is', null);
            filesCount = messagesWithAttachments?.length || 0;
        }

        // Calculate Uptime / System Reliability based on login consistency
        const { data: logins } = await supabase
            .from('login_history')
            .select('login_at')
            .eq('user_id', session.user.id);

        if (!logins || logins.length === 0) {
            return { analyses: analysesCount, files: filesCount, uptime: '0%' };
        }

        const joinDate = new Date(session.user.created_at);
        const now = new Date();
        const totalDays = Math.max(1, Math.ceil((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)));

        const uniqueDays = new Set(logins.map(l => new Date(l.login_at).toDateString())).size;
        const uptimePercent = Math.min(100, (uniqueDays / totalDays) * 100).toFixed(1);

        return {
            analyses: analysesCount,
            files: filesCount,
            uptime: `${uptimePercent}%`
        };
    }
};
