"""
Visualization Explainer Module
Provides detailed explanations, insights, and interpretations for visualizations.
Generates comprehensive analysis of what the visualization shows and what it means for business.
"""

import json
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import numpy as np


class VisualizationExplainer:
    """
    Generates detailed explanations and insights for visualization data.
    Provides business context, interpretations, and actionable recommendations.
    """
    
    def __init__(self):
        self.insight_templates = self._load_insight_templates()
    
    def _load_insight_templates(self) -> Dict[str, Dict[str, str]]:
        """
        Load insight templates for different visualization types and intents.
        """
        return {
            'prediction': {
                'line_chart': {
                    'insight': "The forecast visualization shows predicted values over time with confidence intervals.",
                    'interpretation': "The upward/downward trend indicates expected performance based on historical patterns.",
                    'pattern': "The confidence bands show the uncertainty range - wider bands indicate less certainty.",
                    'actionable': "Consider this forecast for resource planning and budget allocation."
                },
                'bar_chart': {
                    'insight': "The bar chart displays predicted values for each forecast period side-by-side.",
                    'interpretation': "Periods with higher bars represent higher expected values.",
                    'pattern': "The peak period identifies when maximum performance is expected.",
                    'actionable': "Use this to prepare for peak periods and manage resources accordingly."
                },
                'area_chart': {
                    'insight': "The area chart emphasizes the cumulative volume of predictions over time.",
                    'interpretation': "The filled area shows magnitude across the total all periods.",
                    'pattern': "Growing area indicates increasing cumulative values.",
                    'actionable': "Track cumulative forecasts for long-term planning."
                }
            },
            'compare': {
                'bar_chart': {
                    'insight': "This horizontal bar chart ranks different categories by their performance metric.",
                    'interpretation': "The top bar represents the highest performer, making it easy to identify leaders.",
                    'pattern': "The gap between bars shows relative performance differences.",
                    'actionable': "Learn from top performers and investigate underperformers."
                },
                'pie_chart': {
                    'insight': "The pie chart shows the proportional distribution of values across categories.",
                    'interpretation': "Larger slices represent categories with higher contribution to the total.",
                    'pattern': "The percentage shows each category's share of the whole.",
                    'actionable': "Focus on categories with larger shares for maximum impact."
                },
                'radar_chart': {
                    'insight': "The radar chart provides multi-dimensional comparison across categories.",
                    'interpretation': "Categories with larger areas perform better across multiple metrics.",
                    'pattern': "The shape reveals strengths and weaknesses in different dimensions.",
                    'actionable': "Identify well-rounded performers and areas needing improvement."
                }
            },
            'trend': {
                'line_chart': {
                    'insight': "The line chart with trend line shows the overall direction of the metric over time.",
                    'interpretation': "An upward slope indicates growth, downward indicates decline.",
                    'pattern': f"The R² value indicates how well the trend fits the data (0-1 scale).",
                    'actionable': "Use trend direction to make informed strategic decisions."
                },
                'area_chart': {
                    'insight': "The area chart emphasizes the volume and magnitude of the trend.",
                    'interpretation': "Larger filled areas indicate higher values over time.",
                    'pattern': "The momentum (accelerating/decelerating) shows rate of change.",
                    'actionable': "Monitor momentum to anticipate trend reversals."
                }
            },
            'summarise': {
                'dashboard': {
                    'insight': "The executive dashboard provides a comprehensive overview of business performance.",
                    'interpretation': "KPI cards show key metrics at a glance - revenue, profit, and margin.",
                    'pattern': "Growth bars indicate period-over-period changes in key metrics.",
                    'actionable': "Review regularly to track business health and make strategic decisions."
                },
                'kpi_gauge': {
                    'insight': "The KPI gauge displays a single metric's current status against benchmarks.",
                    'interpretation': "Higher values generally indicate better performance for most metrics.",
                    'pattern': "Color coding (green/yellow/red) quickly shows performance status.",
                    'actionable': "Focus on improving metrics showing concerning status."
                }
            }
        }
    
    def explain(self, intent: str, viz_type: str, data: Dict[str, Any], 
                query: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate comprehensive explanation for a visualization.
        
        Args:
            intent: The intent type (prediction, compare, trend, summarise)
            viz_type: The visualization type used
            data: The data that was visualized
            query: Optional original query for context
        
        Returns:
            Dictionary with detailed explanations and insights
        """
        intent = intent.lower()
        viz_type = viz_type.lower()
        
        # Get template-based insights
        templates = self._get_templates(intent, viz_type)
        
        # Generate data-driven insights
        data_insights = self._generate_data_insights(intent, viz_type, data)
        
        # Generate key metrics analysis
        metrics_analysis = self._analyze_metrics(intent, viz_type, data)
        
        # Generate interpretation
        interpretation = self._generate_interpretation(intent, viz_type, data, data_insights)
        
        # Generate actionable recommendations
        recommendations = self._generate_recommendations(intent, viz_type, data, data_insights)
        
        # Generate summary explanation
        summary = self._generate_summary(intent, viz_type, data, data_insights)
        
        return {
            'explanation': {
                'overview': templates.get('insight', 'Visualization generated based on your query.'),
                'interpretation': interpretation,
                'pattern': templates.get('pattern', ''),
                'actionable': templates.get('actionable', '')
            },
            'data_insights': data_insights,
            'metrics_analysis': metrics_analysis,
            'interpretation': interpretation,
            'recommendations': recommendations,
            'summary': summary,
            'viz_type': viz_type,
            'intent': intent,
            'timestamp': datetime.now().isoformat()
        }
    
    def _get_templates(self, intent: str, viz_type: str) -> Dict[str, str]:
        """
        Get template-based insights for the given intent and visualization type.
        """
        try:
            return self.insight_templates[intent][viz_type]
        except KeyError:
            # Try to find a more general template
            try:
                return self.insight_templates[intent]['line_chart']
            except KeyError:
                return {
                    'insight': 'Visualization generated based on your query.',
                    'interpretation': 'Data has been analyzed and presented visually.',
                    'pattern': 'Review the visualization for patterns and trends.',
                    'actionable': 'Use insights for decision making.'
                }
    
    def _generate_data_insights(self, intent: str, viz_type: str, 
                                 data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate data-driven insights from the visualization data.
        """
        insights = {
            'key_findings': [],
            'statistics': {},
            'anomalies': [],
            'correlations': []
        }
        
        if intent == 'prediction':
            # Analyze forecast data
            forecast = data.get('forecast', [])
            if forecast and isinstance(forecast, list):
                values = [f.get('predicted_value', 0) for f in forecast]
                if values:
                    insights['statistics'] = {
                        'min_value': float(min(values)),
                        'max_value': float(max(values)),
                        'avg_value': float(np.mean(values)),
                        'total_forecast': float(sum(values)),
                        'trend_direction': 'upward' if values[-1] > values[0] else 'downward',
                        'growth_rate': float((values[-1] - values[0]) / values[0] * 100) if values[0] != 0 else 0
                    }
                    
                    # Key findings
                    if values[-1] > values[0]:
                        insights['key_findings'].append(
                            f"Forecast shows an overall upward trend with {((values[-1] - values[0]) / values[0] * 100):.1f}% growth"
                        )
                    else:
                        insights['key_findings'].append(
                            f"Forecast indicates a downward trend with {((values[0] - values[-1]) / values[0] * 100):.1f}% decrease"
                        )
                    
                    # Peak identification
                    max_idx = values.index(max(values))
                    insights['key_findings'].append(
                        f"Peak performance expected in period {max_idx + 1} with value ${max(values):,.0f}"
                    )
        
        elif intent == 'compare':
            # Analyze comparison data
            results = data.get('results', [])
            if results:
                # Get the metric being compared
                metric = data.get('metric', 'revenue')
                values = []
                names = []
                
                for r in results:
                    sort_key = f"total_{metric}" if metric != 'profit_margin' else 'avg_margin'
                    val = r.get(sort_key, 0)
                    values.append(val)
                    names.append(r.get('name', 'Unknown'))
                
                if values:
                    total = sum(values)
                    insights['statistics'] = {
                        'total_value': float(total),
                        'top_performer': names[0] if names else 'N/A',
                        'top_value': float(values[0]) if values else 0,
                        'average': float(np.mean(values)),
                        'std_deviation': float(np.std(values)) if len(values) > 1 else 0,
                        'number_compared': len(values)
                    }
                    
                    # Key findings
                    if names and values:
                        insights['key_findings'].append(
                            f"{names[0]} leads with ${values[0]:,.0f} in {metric}"
                        )
                    
                    if len(values) > 1:
                        diff_pct = ((values[0] - values[1]) / values[1] * 100) if values[1] != 0 else 0
                        insights['key_findings'].append(
                            f"{names[0]} is {diff_pct:.1f}% ahead of {names[1]}"
                        )
                    
                    # Top performer dominance
                    if total > 0:
                        dominance = (values[0] / total * 100) if total > 0 else 0
                        insights['key_findings'].append(
                            f"Top performer accounts for {dominance:.1f}% of total"
                        )
        
        elif intent == 'trend':
            # Analyze trend data
            forecast = data.get('forecast', [])
            if forecast and isinstance(forecast, list):
                values = [f.get('predicted_value', 0) for f in forecast]
                if values:
                    # Calculate trend metrics
                    x = np.arange(len(values))
                    if len(values) > 1:
                        slope, intercept = np.polyfit(x, values, 1)
                        correlation = np.corrcoef(x, values)[0, 1]
                        
                        insights['statistics'] = {
                            'trend_slope': float(slope),
                            'correlation': float(correlation),
                            'trend_direction': 'increasing' if slope > 0 else 'decreasing',
                            'min_value': float(min(values)),
                            'max_value': float(max(values)),
                            'range': float(max(values) - min(values))
                        }
                        
                        # Trend direction finding
                        if slope > 0:
                            insights['key_findings'].append(
                                f"Trend is increasing with slope of {slope:.2f} per period"
                            )
                        else:
                            insights['key_findings'].append(
                                f"Trend is decreasing with slope of {abs(slope):.2f} per period"
                            )
                        
                        # Correlation finding
                        strong_correlation = abs(correlation) > 0.7
                        insights['key_findings'].append(
                            f"{'Strong' if strong_correlation else 'Moderate'} correlation ({correlation:.2f}) between time and values"
                        )
        
        elif intent == 'summarise':
            # Analyze summary/dashboard data
            metrics = data.get('metrics', {})
            overall = metrics.get('overall', {})
            growth = metrics.get('growth', {})
            
            if overall:
                insights['statistics'] = {
                    'total_revenue': float(overall.get('total_revenue', 0)),
                    'total_profit': float(overall.get('total_profit', 0)),
                    'profit_margin': float(overall.get('average_profit_margin', 0)),
                    'revenue_growth': float(growth.get('revenue_growth_percent', 0)),
                    'profit_growth': float(growth.get('profit_growth_percent', 0))
                }
                
                # Key findings
                revenue = overall.get('total_revenue', 0)
                profit = overall.get('total_profit', 0)
                margin = overall.get('average_profit_margin', 0)
                
                if revenue > 0:
                    insights['key_findings'].append(
                        f"Total revenue: ${revenue:,.0f}"
                    )
                if profit > 0:
                    insights['key_findings'].append(
                        f"Total profit: ${profit:,.0f}"
                    )
                if margin > 0:
                    status = "healthy" if margin > 15 else "moderate" if margin > 10 else "low"
                    insights['key_findings'].append(
                        f"Profit margin: {margin:.1f}% (considered {status})"
                    )
                
                # Growth findings
                if growth:
                    rev_growth = growth.get('revenue_growth_percent', 0)
                    if rev_growth > 0:
                        insights['key_findings'].append(
                            f"Revenue grew by {rev_growth:+.1f}% compared to previous period"
                        )
                    elif rev_growth < 0:
                        insights['key_findings'].append(
                            f"Revenue declined by {abs(rev_growth):.1f}% compared to previous period"
                        )
        
        return insights
    
    def _analyze_metrics(self, intent: str, viz_type: str, 
                          data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze key metrics from the visualization data.
        """
        analysis = {
            'primary_metric': {},
            'supporting_metrics': [],
            'health_indicators': {}
        }
        
        if intent == 'prediction':
            forecast = data.get('forecast', [])
            if forecast and isinstance(forecast, list):
                values = [f.get('predicted_value', 0) for f in forecast]
                if values:
                    analysis['primary_metric'] = {
                        'name': 'Forecast Value',
                        'value': float(values[-1]),  # Most recent prediction
                        'previous_value': float(values[0]) if len(values) > 1 else None,
                        'unit': 'currency'
                    }
                    
                    # Calculate period-over-period changes
                    if len(values) > 1:
                        changes = [(values[i] - values[i-1]) / values[i-1] * 100 
                                   for i in range(1, len(values)) if values[i-1] != 0]
                        if changes:
                            analysis['health_indicators'] = {
                                'avg_period_change': float(np.mean(changes)),
                                'volatility': float(np.std(changes)),
                                'trend_stability': 'stable' if np.std(changes) < 10 else 'volatile'
                            }
        
        elif intent == 'compare':
            results = data.get('results', [])
            metric = data.get('metric', 'revenue')
            if results:
                sort_key = f"total_{metric}" if metric != 'profit_margin' else 'avg_margin'
                values = [r.get(sort_key, 0) for r in results]
                
                analysis['primary_metric'] = {
                    'name': metric.replace('_', ' ').title(),
                    'top_value': float(values[0]) if values else 0,
                    'unit': 'currency' if metric != 'profit_margin' else 'percentage'
                }
                
                if len(values) > 1:
                    analysis['health_indicators'] = {
                        'gap_between_top2': float(values[0] - values[1]) if len(values) > 1 else 0,
                        'gap_percentage': float((values[0] - values[1]) / values[1] * 100) if values[1] != 0 else 0
                    }
        
        elif intent == 'summarise':
            metrics = data.get('metrics', {})
            overall = metrics.get('overall', {})
            growth = metrics.get('growth', {})
            
            if overall:
                analysis['primary_metric'] = {
                    'name': 'Total Revenue',
                    'value': float(overall.get('total_revenue', 0)),
                    'unit': 'currency'
                }
                
                # Health indicators based on common KPIs
                margin = overall.get('average_profit_margin', 0)
                revenue_growth = growth.get('revenue_growth_percent', 0)
                
                analysis['health_indicators'] = {
                    'profit_margin_status': 'good' if margin > 15 else 'warning' if margin > 10 else 'critical',
                    'revenue_growth_status': 'good' if revenue_growth > 10 else 'warning' if revenue_growth > 0 else 'negative'
                }
        
        return analysis
    
    def _generate_interpretation(self, intent: str, viz_type: str, 
                                  data: Dict[str, Any], 
                                  data_insights: Dict[str, Any]) -> str:
        """
        Generate a natural language interpretation of the visualization.
        """
        interpretations = []
        stats = data_insights.get('statistics', {})
        
        if intent == 'prediction':
            trend = stats.get('trend_direction', 'stable')
            growth = stats.get('growth_rate', 0)
            
            if trend == 'upward':
                interpretations.append(
                    f"The forecast predicts an upward trajectory with approximately {abs(growth):.1f}% growth "
                    f"from the first to the last period."
                )
            else:
                interpretations.append(
                    f"The forecast indicates a downward trend with approximately {abs(growth):.1f}% decline "
                    f"over the forecast period."
                )
            
            if 'peak_value' in stats:
                interpretations.append(
                    f"The highest predicted value is ${stats['peak_value']:,.0f}."
                )
        
        elif intent == 'compare':
            top = stats.get('top_performer', 'Unknown')
            top_val = stats.get('top_value', 0)
            
            interpretations.append(
                f"{top} is the leading performer with ${top_val:,.0f} in the measured metric."
            )
            
            if stats.get('number_compared', 0) > 1:
                dominance = (top_val / stats.get('total_value', 1) * 100) if stats.get('total_value', 0) > 0 else 0
                interpretations.append(
                    f"This top performer accounts for {dominance:.1f}% of the total across {stats['number_compared']} categories analyzed."
                )
        
        elif intent == 'trend':
            direction = stats.get('trend_direction', 'unknown')
            correlation = stats.get('correlation', 0)
            
            if direction == 'increasing':
                interpretations.append(
                    "The trend analysis shows an increasing pattern over time, "
                    "indicating positive momentum in the measured metric."
                )
            else:
                interpretations.append(
                    "The trend analysis shows a decreasing pattern, "
                    "suggesting challenges that may require attention."
                )
            
            strength = "strong" if abs(correlation) > 0.7 else "moderate"
            interpretations.append(
                f"There is a {strength} correlation ({correlation:.2f}) between time and the metric values."
            )
        
        elif intent == 'summarise':
            revenue = stats.get('total_revenue', 0)
            profit = stats.get('total_profit', 0)
            margin = stats.get('profit_margin', 0)
            
            interpretations.append(
                f"The business generated ${revenue:,.0f} in total revenue with ${profit:,.0f} in profit."
            )
            
            if margin > 0:
                status = "healthy" if margin > 15 else "moderate" if margin > 10 else "concerning"
                interpretations.append(
                    f"The profit margin of {margin:.1f}% is considered {status}."
                )
            
            rev_growth = stats.get('revenue_growth', 0)
            if rev_growth > 0:
                interpretations.append(
                    f"Revenue has grown by {rev_growth:+.1f}% compared to the previous period."
                )
        
        return " ".join(interpretations)
    
    def _generate_recommendations(self, intent: str, viz_type: str, 
                                   data: Dict[str, Any],
                                   data_insights: Dict[str, Any]) -> List[str]:
        """
        Generate actionable recommendations based on the visualization.
        """
        recommendations = []
        stats = data_insights.get('statistics', {})
        
        if intent == 'prediction':
            trend = stats.get('trend_direction', 'stable')
            
            if trend == 'upward':
                recommendations.append(
                    "Consider increasing investment in growth initiatives to capitalize on the positive forecast."
                )
                recommendations.append(
                    "Prepare additional capacity to handle expected increased demand."
                )
            else:
                recommendations.append(
                    "Review current strategies and identify areas for improvement."
                )
                recommendations.append(
                    "Consider cost optimization measures to maintain profitability during decline."
                )
            
            recommendations.append(
                "Monitor actual performance against forecasts and adjust plans as needed."
            )
        
        elif intent == 'compare':
            recommendations.append(
                "Analyze top performers to identify best practices that can be applied elsewhere."
            )
            
            gap = stats.get('top_value', 0) - stats.get('average', 0)
            if gap > 0:
                recommendations.append(
                    f"Investigate the ${gap:,.0f} gap between top performer and average."
                )
            
            recommendations.append(
                "Develop strategies to bring underperformers up to standard."
            )
        
        elif intent == 'trend':
            recommendations.append(
                "Continue current strategies if the trend is positive and sustainable."
            )
            
            correlation = stats.get('correlation', 0)
            if abs(correlation) > 0.7:
                recommendations.append(
                    f"The strong correlation ({correlation:.2f}) suggests the trend is reliable."
                )
            else:
                recommendations.append(
                    "The moderate correlation indicates some variability - maintain flexibility in planning."
                )
        
        elif intent == 'summarise':
            margin = stats.get('profit_margin', 0)
            if margin < 10:
                recommendations.append(
                    "Priority: Improve profit margins through pricing strategies or cost reduction."
                )
            
            rev_growth = stats.get('revenue_growth', 0)
            if rev_growth < 0:
                recommendations.append(
                    "Urgent: Revenue decline requires immediate attention to sales and marketing."
                )
            
            recommendations.append(
                "Regular monitoring of KPIs is recommended for sustained business health."
            )
        
        return recommendations
    
    def _generate_summary(self, intent: str, viz_type: str, 
                          data: Dict[str, Any],
                          data_insights: Dict[str, Any]) -> str:
        """
        Generate a comprehensive summary of the visualization analysis.
        """
        findings = data_insights.get('key_findings', [])
        
        if findings:
            summary = "Key Takeaways:\n"
            for i, finding in enumerate(findings[:3], 1):  # Limit to top 3
                summary += f"{i}. {finding}\n"
            return summary.strip()
        
        return "Analysis completed. Review the visualization and insights for details."
    
    def explain_query_result(self, query: str, intent: str, 
                              viz_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate explanation for a complete query result.
        Combines query context with visualization analysis.
        """
        # Extract data from viz_result
        viz_data = viz_result.get('visualization', {})
        response_data = viz_result.get('response', {})
        
        # Get the visualization type
        viz_type = viz_data.get('type', 'line_chart') if isinstance(viz_data, dict) else 'line_chart'
        
        # Generate explanation
        explanation = self.explain(intent, viz_type, response_data, query)
        
        # Add query context
        explanation['query_context'] = {
            'original_query': query,
            'intent_detected': intent,
            'question_answer': self._answer_query(query, intent, response_data, explanation)
        }
        
        return explanation
    
    def _answer_query(self, query: str, intent: str, 
                      data: Dict[str, Any],
                      explanation: Dict[str, Any]) -> str:
        """
        Generate a direct answer to the user's query based on the analysis.
        """
        query_lower = query.lower()
        
        if intent == 'prediction':
            stats = explanation.get('data_insights', {}).get('statistics', {})
            direction = stats.get('trend_direction', 'stable')
            growth = stats.get('growth_rate', 0)
            
            if 'next' in query_lower or 'future' in query_lower or 'will' in query_lower:
                return f"Based on the forecast, the predicted values show a {direction} trend with approximately {abs(growth):.1f}% change over the forecast period."
        
        elif intent == 'compare':
            stats = explanation.get('data_insights', {}).get('statistics', {})
            top = stats.get('top_performer', 'Unknown')
            top_val = stats.get('top_value', 0)
            
            if 'best' in query_lower or 'highest' in query_lower or 'top' in query_lower:
                return f"{top} is the top performer with ${top_val:,.0f} in the measured metric."
            elif 'compare' in query_lower or 'difference' in query_lower:
                return f"Comparison shows {top} leading with ${top_val:,.0f}, significantly ahead of others."
        
        elif intent == 'trend':
            stats = explanation.get('data_insights', {}).get('statistics', {})
            direction = stats.get('trend_direction', 'unknown')
            
            if 'trend' in query_lower or 'direction' in query_lower:
                return f"The trend analysis reveals a {direction} pattern in the data over time."
        
        elif intent == 'summarise':
            stats = explanation.get('data_insights', {}).get('statistics', {})
            revenue = stats.get('total_revenue', 0)
            profit = stats.get('total_profit', 0)
            margin = stats.get('profit_margin', 0)
            
            return f"Executive summary: Total revenue ${revenue:,.0f}, profit ${profit:,.0f}, profit margin {margin:.1f}%."
        
        return "Analysis completed based on your query."


# Convenience function
def explain_visualization(intent: str, viz_type: str, data: Dict[str, Any],
                          query: Optional[str] = None) -> Dict[str, Any]:
    """
    Convenience function to explain a visualization.
    """
    explainer = VisualizationExplainer()
    return explainer.explain(intent, viz_type, data, query)


def explain_query_result_full(query: str, intent: str, 
                                viz_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convenience function to explain a full query result with context.
    """
    explainer = VisualizationExplainer()
    return explainer.explain_query_result(query, intent, viz_result)


if __name__ == "__main__":
    # Test the explainer
    print("=" * 70)
    print("VISUALIZATION EXPLAINER TEST")
    print("=" * 70)
    
    explainer = VisualizationExplainer()
    
    # Test prediction explanation
    test_prediction_data = {
        'forecast': [
            {'predicted_date': '2024-01-01', 'predicted_value': 50000, 'confidence': 'high'},
            {'predicted_date': '2024-02-01', 'predicted_value': 55000, 'confidence': 'medium'},
            {'predicted_date': '2024-03-01', 'predicted_value': 60000, 'confidence': 'high'},
        ]
    }
    
    result = explainer.explain('prediction', 'line_chart', test_prediction_data)
    
    print("\n--- PREDICTION EXPLANATION ---")
    print(f"\nOverview: {result['explanation']['overview']}")
    print(f"\nInterpretation: {result['interpretation']}")
    print(f"\nKey Findings:")
    for finding in result['data_insights']['key_findings']:
        print(f"  - {finding}")
    print(f"\nRecommendations:")
    for rec in result['recommendations']:
        print(f"  - {rec}")
    
    # Test comparison explanation
    test_compare_data = {
        'compare_type': 'region',
        'metric': 'revenue',
        'results': [
            {'name': 'North', 'total_revenue': 150000, 'rank': 1},
            {'name': 'South', 'total_revenue': 80000, 'rank': 2},
            {'name': 'East', 'total_revenue': 45000, 'rank': 3},
        ]
    }
    
    result = explainer.explain('compare', 'bar_chart', test_compare_data)
    
    print("\n--- COMPARISON EXPLANATION ---")
    print(f"\nInterpretation: {result['interpretation']}")
    print(f"\nKey Findings:")
    for finding in result['data_insights']['key_findings']:
        print(f"  - {finding}")
    
    print("\n" + "=" * 70)
    print("EXPLAINER TEST COMPLETE")
    print("=" * 70)
