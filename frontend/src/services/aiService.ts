
export interface AIResponse {
    intent: string;
    entities: string[];
    response: any;
    ai_analysis: string;
    chart_type: 'line' | 'bar' | 'area';
}

class AIService {
    async analyzeQuery(query: string): Promise<AIResponse> {
        try {
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error calling backend:', error);
            return {
                intent: 'ERROR',
                entities: [],
                response: { message: "Could not connect to the analysis engine API." },
                ai_analysis: "Connection failed.",
                chart_type: 'bar'
            };
        }
    }

    async getMetrics(apiKey: string) {
        // Backend disconnected
        console.log('Mocking metrics for apiKey:', apiKey);
        return {
            message: "Metrics unavailable - backend disconnected."
        };
    }
}

export const aiService = new AIService();
