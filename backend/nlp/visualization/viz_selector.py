"""
Visualization Selector Module
Intelligently selects the best visualization(s) based on query analysis.
Analyzes query intent, context (month/quarter), and data characteristics.
Enhanced with more granular selection and diversity for different queries.
"""

import re
import hashlib
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime


class VisualizationSelector:
    """
    Intelligent visualization selector that analyzes queries and selects
    the most appropriate visualization(s) for the given context.
    Enhanced with diversity - ensures different queries get different viz types.
    """
    
    def __init__(self):
        # Month mapping for query extraction
        self.month_map = {
            'january': 1, 'jan': 1,
            'february': 2, 'feb': 2,
            'march': 3, 'mar': 3,
            'april': 4, 'apr': 4,
            'may': 5,
            'june': 6, 'jun': 6,
            'july': 7, 'jul': 7,
            'august': 8, 'aug': 8,
            'september': 9, 'sep': 9, 'sept': 9,
            'october': 10, 'oct': 10,
            'november': 11, 'nov': 11,
            'december': 12, 'dec': 12
        }
        
        # Quarter mapping
        self.quarter_map = {
            'q1': (1, 3), 'quarter 1': (1, 3),
            'q2': (4, 6), 'quarter 2': (4, 6),
            'q3': (7, 9), 'quarter 3': (7, 9),
            'q4': (10, 12), 'quarter 4': (10, 12)
        }
        
        # Metric-specific keywords mapping
        self.metric_keywords = {
            'revenue': ['revenue', 'sales', 'income', 'sales revenue', 'total revenue'],
            'profit': ['profit', 'earnings', 'margin', 'profit margin', 'net profit', 'gross profit'],
            'units': ['units', 'quantity', 'volume', 'units sold', 'items'],
            'customers': ['customer', 'customers', 'acquisition', 'new customers', 'customer count'],
            'growth': ['growth', 'increase', 'decrease', 'change', 'growth rate'],
            'expenses': ['expense', 'cost', 'costs', 'spending', 'expenditure']
        }
        
        # Visualization recommendations by intent and context - ENHANCED with MORE types
        self.viz_recommendations = self._init_viz_recommendations()
        
        # Track last few selections for diversity
        self._recent_selections = []
        self._max_recent = 5
        
        # Chart type keywords - map user words to viz types
        self.chart_type_keywords = {
            'line_chart': ['line chart', 'line graph', 'lines', 'line'],
            'bar_chart': ['bar chart', 'bar graph', 'bars', 'bar'],
            'area_chart': ['area chart', 'area graph', 'area'],
            'pie_chart': ['pie chart', 'pie graph', 'pie', 'circle chart'],
            'scatter_chart': ['scatter plot', 'scatter', 'scatter chart'],
            'bubble_chart': ['bubble chart', 'bubble', 'bubbles'],
            'radar_chart': ['radar chart', 'radar', 'spider chart', 'web chart'],
            'gauge_chart': ['gauge', 'gauge chart', 'speedometer', 'dial'],
            'heatmap': ['heat map', 'heatmap', 'heat map'],
            'stacked_bar': ['stacked bar', 'stacked'],
            'grouped_bar': ['grouped bar', 'grouped'],
            'column_chart': ['column chart', 'column', 'columns'],
            'candlestick': ['candlestick', 'candle', 'candles'],
            'dashboard': ['dashboard', 'dash', 'dashboards'],
            'kpi_gauge': ['kpi', 'kpi gauge', 'kpi card'],
            'scorecard': ['scorecard', 'score card', 'score'],
            'funnel': ['funnel', 'funnel chart'],
            'waterfall': ['waterfall', 'waterfall chart'],
            'treemap': ['treemap', 'tree map', 'tree'],
            'sparkline': ['sparkline', 'spark line', 'spark'],
        }
        
    def _init_viz_recommendations(self) -> Dict[str, Dict[str, List[Dict]]]:
        """
        Initialize visualization recommendations for each intent and context.
        ENHANCED with many more visualization types for diversity.
        """
        return {
            'prediction': {
                # Next month predictions
                'next_month': [
                    {'viz_type': 'bar_chart', 'reason': 'Clear single-month prediction with value'},
                    {'viz_type': 'gauge_chart', 'reason': 'Shows target vs prediction'},
                    {'viz_type': 'bullet_chart', 'reason': 'Prediction vs target comparison'}
                ],
                # Next quarter predictions  
                'next_quarter': [
                    {'viz_type': 'bar_chart', 'reason': 'Clear quarterly comparison'},
                    {'viz_type': 'grouped_bar', 'reason': 'Shows each month within quarter'},
                    {'viz_type': 'stacked_bar', 'reason': 'Quarter components'}
                ],
                # Multiple months (6 months, year, etc.)
                'long_term': [
                    {'viz_type': 'line_chart', 'reason': 'Best for long-term forecast trends'},
                    {'viz_type': 'area_chart', 'reason': 'Emphasizes cumulative forecast'},
                    {'viz_type': 'multi_line', 'reason': 'Shows forecast with confidence bands'}
                ],
                # Specific month (March, April, etc.)
                'specific_month': [
                    {'viz_type': 'bar_chart', 'reason': 'Clear single prediction value'},
                    {'viz_type': 'gauge_chart', 'reason': 'Shows prediction as gauge'},
                    {'viz_type': 'candlestick', 'reason': 'Shows prediction range'}
                ],
                # Default/fallback
                'default': [
                    {'viz_type': 'line_chart', 'reason': 'Best for showing forecast trends over time'},
                    {'viz_type': 'area_chart', 'reason': 'Emphasizes cumulative volume'},
                    {'viz_type': 'bar_chart', 'reason': 'Clear comparison of predicted values'},
                    {'viz_type': 'candlestick', 'reason': 'Shows forecast with confidence range'}
                ]
            },
            'compare': {
                'region': [
                    {'viz_type': 'bar_chart', 'reason': 'Best for regional ranking comparison'},
                    {'viz_type': 'choropleth_map', 'reason': 'Geographic visualization of regions'},
                    {'viz_type': 'bubble_map', 'reason': 'Regions with sized bubbles'},
                    {'viz_type': 'radar_chart', 'reason': 'Multi-metric regional comparison'}
                ],
                'category': [
                    {'viz_type': 'bar_chart', 'reason': 'Best for category ranking'},
                    {'viz_type': 'pie_chart', 'reason': 'Shows category distribution'},
                    {'viz_type': 'treemap', 'reason': 'Hierarchical category view'},
                    {'viz_type': 'donut_chart', 'reason': 'Modern category breakdown'}
                ],
                'product': [
                    {'viz_type': 'bar_chart', 'reason': 'Product performance ranking'},
                    {'viz_type': 'horizontal_bar', 'reason': 'Easy product name reading'},
                    {'viz_type': 'bubble_chart', 'reason': 'Products sized by performance'},
                    {'viz_type': 'lollipop', 'reason': 'Modern product comparison'}
                ],
                'time': [
                    {'viz_type': 'grouped_bar', 'reason': 'Side-by-side time comparison'},
                    {'viz_type': 'line_chart', 'reason': 'Time series comparison'},
                    {'viz_type': 'overlay_line', 'reason': 'Multiple periods overlaid'},
                    {'viz_type': 'slope_chart', 'reason': 'Shows change between periods'}
                ],
                'default': [
                    {'viz_type': 'bar_chart', 'reason': 'Best for ranking comparisons'},
                    {'viz_type': 'pie_chart', 'reason': 'Shows proportional distribution'},
                    {'viz_type': 'radar_chart', 'reason': 'Multi-dimensional comparison'},
                    {'viz_type': 'heatmap', 'reason': 'Shows patterns across dimensions'}
                ]
            },
            'trend': {
                'revenue': [
                    {'viz_type': 'line_chart', 'reason': 'Classic revenue trend'},
                    {'viz_type': 'area_chart', 'reason': 'Emphasizes revenue volume'},
                    {'viz_type': 'sparkline', 'reason': 'Compact trend overview'},
                    {'viz_type': 'column_with_trend', 'reason': 'Bars with trend line'}
                ],
                'profit': [
                    {'viz_type': 'line_chart', 'reason': 'Profit trend over time'},
                    {'viz_type': 'waterfall_chart', 'reason': 'Shows profit changes'},
                    {'viz_type': 'step_chart', 'reason': 'Shows profit step changes'}
                ],
                'customers': [
                    {'viz_type': 'line_chart', 'reason': 'Customer acquisition trend'},
                    {'viz_type': 'area_chart', 'reason': 'Cumulative customer view'},
                    {'viz_type': 'column_chart', 'reason': 'Monthly customer counts'},
                    {'viz_type': 'growth_arrow', 'reason': 'Shows growth direction'}
                ],
                'seasonal': [
                    {'viz_type': 'seasonal_decomposition', 'reason': 'Shows seasonal patterns'},
                    {'viz_type': 'radar_chart', 'reason': 'Seasonal comparison'},
                    {'viz_type': 'polar_chart', 'reason': 'Cyclical seasonal view'}
                ],
                'default': [
                    {'viz_type': 'line_chart', 'reason': 'Classic trend visualization'},
                    {'viz_type': 'area_chart', 'reason': 'Emphasizes trend magnitude'},
                    {'viz_type': 'multi_line', 'reason': 'Shows multiple trends together'},
                    {'viz_type': 'trend_arrow', 'reason': 'Directional trend indicator'}
                ]
            },
            'summarise': {
                'executive': [
                    {'viz_type': 'dashboard', 'reason': 'Comprehensive executive overview'},
                    {'viz_type': 'kpi_cards', 'reason': 'Key metrics at a glance'},
                    {'viz_type': 'scorecard', 'reason': 'Quick performance summary'}
                ],
                'financial': [
                    {'viz_type': 'dashboard', 'reason': 'Financial overview'},
                    {'viz_type': 'kpi_gauge', 'reason': 'Key financial metrics'},
                    {'viz_type': 'waterfall_chart', 'reason': 'Shows financial flow'},
                    {'viz_type': 'bullet_chart', 'reason': 'Targets vs actual'}
                ],
                'performance': [
                    {'viz_type': 'dashboard', 'reason': 'Performance overview'},
                    {'viz_type': 'radar_chart', 'reason': 'Multi-metric performance'},
                    {'viz_type': 'gauge_chart', 'reason': 'Performance indicators'},
                    {'viz_type': 'progress_ring', 'reason': 'Progress visualization'}
                ],
                'monthly': [
                    {'viz_type': 'summary_table', 'reason': 'Monthly breakdown'},
                    {'viz_type': 'mini_charts', 'reason': 'Multiple metrics in one view'},
                    {'viz_type': 'calendar_heatmap', 'reason': 'Daily activity patterns'},
                    {'viz_type': 'sparkline_table', 'reason': 'Table with inline trends'}
                ],
                'quarterly': [
                    {'viz_type': 'dashboard', 'reason': 'Quarterly business overview'},
                    {'viz_type': 'kpi_gauge', 'reason': 'Quarterly KPI status'},
                    {'viz_type': 'bullet_chart', 'reason': 'Quarterly targets vs actual'},
                    {'viz_type': 'column_range', 'reason': 'Quarterly range view'}
                ],
                'default': [
                    {'viz_type': 'dashboard', 'reason': 'Comprehensive overview'},
                    {'viz_type': 'kpi_gauge', 'reason': 'Key metrics at a glance'},
                    {'viz_type': 'scorecard', 'reason': 'Quick performance summary'},
                    {'viz_type': 'summary_card', 'reason': 'Executive summary card'}
                ]
            }
        }
    
    def analyze_query(self, query: str, intent: str = None) -> Dict[str, Any]:
        """
        Analyze a query to extract intent, time period, and other context.
        
        Args:
            query: User's natural language query
            intent: Optional pre-classified intent (will extract if not provided)
        
        Returns:
            Dictionary with query analysis results
        """
        query_lower = query.lower()
        
        # Extract time period
        time_period = self._extract_time_period(query_lower)
        
        # Extract comparison targets
        comparison_targets = self._extract_comparison_targets(query_lower)
        
        # Extract metrics
        metrics = self._extract_metrics(query_lower)
        
        # Determine context
        context = 'monthly' if time_period.get('type') in ['month', 'quarter'] else 'default'
        
        # If intent not provided, try to infer from query
        if intent is None:
            intent = self._infer_intent_from_query(query_lower)
        
        return {
            'original_query': query,
            'intent': intent,
            'time_period': time_period,
            'comparison_targets': comparison_targets,
            'metrics': metrics,
            'context': context
        }
    
    def _extract_time_period(self, query: str) -> Dict[str, Any]:
        """
        Extract time period (month, quarter, year) from query.
        """
        # Check for month names
        for month_name, month_num in self.month_map.items():
            if month_name in query:
                return {
                    'type': 'month',
                    'value': month_name,
                    'month_num': month_num,
                    'display': month_name.capitalize()
                }
        
        # Check for quarters
        for quarter, months in self.quarter_map.items():
            if quarter in query:
                return {
                    'type': 'quarter',
                    'value': quarter,
                    'start_month': months[0],
                    'end_month': months[1],
                    'display': quarter.upper()
                }
        
        # Check for year patterns
        year_match = re.search(r'(20\d{2}|19\d{2})', query)
        if year_match:
            return {
                'type': 'year',
                'value': year_match.group(1),
                'year': int(year_match.group(1))
            }
        
        # Check for relative time
        if 'next month' in query or 'upcoming month' in query:
            return {'type': 'next_month', 'display': 'Next Month'}
        elif 'last month' in query or 'previous month' in query:
            return {'type': 'last_month', 'display': 'Last Month'}
        elif 'next quarter' in query:
            return {'type': 'next_quarter', 'display': 'Next Quarter'}
        elif 'last quarter' in query:
            return {'type': 'last_quarter', 'display': 'Last Quarter'}
        
        return {'type': 'all', 'display': 'All Time'}
    
    def _extract_comparison_targets(self, query: str) -> List[str]:
        """
        Extract what is being compared in the query.
        """
        targets = []
        
        # Region patterns
        regions = ['north', 'south', 'east', 'west', 'region']
        for region in regions:
            if region in query:
                targets.append('region')
                break
        
        # Category patterns
        categories = ['category', 'product', 'item', 'type']
        for cat in categories:
            if cat in query:
                targets.append('category')
                break
        
        # Time comparison
        if any(x in query for x in ['compare', 'vs', 'versus', 'difference']):
            if 'month' in query or 'quarter' in query:
                targets.append('time')
        
        return list(set(targets)) if targets else ['default']
    
    def _extract_metrics(self, query: str) -> List[str]:
        """
        Extract what metrics are being referenced in the query.
        ENHANCED with more comprehensive metric detection.
        """
        metrics = []
        
        for metric_name, keywords in self.metric_keywords.items():
            if any(kw in query for kw in keywords):
                metrics.append(metric_name)
        
        return metrics if metrics else ['default']
    
    def _get_detailed_context(self, query_analysis: Dict[str, Any]) -> str:
        """
        Get detailed context based on intent, time period, and metrics.
        This provides more granular context for visualization selection.
        """
        intent = query_analysis.get('intent', 'summarise')
        time_period = query_analysis.get('time_period', {})
        metrics = query_analysis.get('metrics', ['default'])
        comparison_targets = query_analysis.get('comparison_targets', ['default'])
        
        # For prediction intent
        if intent == 'prediction':
            time_type = time_period.get('type', 'default')
            if time_type == 'next_month':
                return 'next_month'
            elif time_type == 'next_quarter':
                return 'next_quarter'
            elif time_type in ['month', 'specific_month']:
                return 'specific_month'
            elif '6 month' in query_analysis.get('original_query', '').lower() or \
                 'year' in query_analysis.get('original_query', '').lower():
                return 'long_term'
            return 'default'
        
        # For compare intent
        elif intent == 'compare':
            if 'region' in comparison_targets:
                return 'region'
            elif 'category' in comparison_targets:
                return 'category'
            elif 'product' in comparison_targets:
                return 'product'
            elif 'time' in comparison_targets:
                return 'time'
            return 'default'
        
        # For trend intent
        elif intent == 'trend':
            if 'revenue' in metrics:
                return 'revenue'
            elif 'profit' in metrics:
                return 'profit'
            elif 'customers' in metrics:
                return 'customers'
            elif 'seasonal' in query_analysis.get('original_query', '').lower():
                return 'seasonal'
            return 'default'
        
        # For summarise intent
        elif intent == 'summarise':
            query_lower = query_analysis.get('original_query', '').lower()
            if 'executive' in query_lower:
                return 'executive'
            elif 'financial' in query_lower:
                return 'financial'
            elif 'performance' in query_lower:
                return 'performance'
            elif time_period.get('type') == 'month':
                return 'monthly'
            elif time_period.get('type') == 'quarter':
                return 'quarterly'
            return 'default'
        
        return 'default'
    
    def _get_query_hash(self, query: str) -> int:
        """
        Generate a hash from the query for deterministic but diverse selection.
        """
        return int(hashlib.md5(query.encode()).hexdigest(), 16)
    
    def _infer_intent_from_query(self, query: str) -> str:
        """
        Infer intent from query text if not provided.
        """
        intent_keywords = {
            'prediction': ['predict', 'forecast', 'future', 'next', 'will be', 'estimate', 'project'],
            'compare': ['compare', 'comparison', 'versus', 'vs', 'difference', 'better', 'best', 'rank'],
            'trend': ['trend', 'trending', 'pattern', 'direction', 'increasing', 'decreasing', 'growth'],
            'summarise': ['summarize', 'summary', 'overview', 'brief', 'report', 'executive', 'overall']
        }
        
        scores = {}
        for intent, keywords in intent_keywords.items():
            scores[intent] = sum(1 for kw in keywords if kw in query)
        
        if max(scores.values()) == 0:
            return 'summarise'  # Default intent
        
        return max(scores, key=scores.get)
    
    def select_visualization(self, query_analysis: Dict[str, Any], 
                            data_characteristics: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Select the best visualization(s) based on query analysis and data.
        ENHANCED to use detailed context for more diverse selections.
        
        Args:
            query_analysis: Result from analyze_query()
            data_characteristics: Optional data characteristics (size, type, etc.)
        
        Returns:
            List of recommended visualizations with reasons
        """
        intent = query_analysis['intent']
        
        # Get detailed context for more granular selection
        detailed_context = self._get_detailed_context(query_analysis)
        
        # Try to get recommendations for detailed context first
        recommendations = self.viz_recommendations.get(intent, {}).get(detailed_context)
        
        # Fallback to basic context if detailed context not found
        if not recommendations:
            context = query_analysis.get('context', 'default')
            recommendations = self.viz_recommendations.get(intent, {}).get(
                context, 
                self.viz_recommendations.get(intent, {}).get('default', [])
            )
        
        # Filter based on data characteristics if provided
        if data_characteristics:
            recommendations = self._filter_by_data(recommendations, data_characteristics)
        
        # Add time period context to recommendations
        time_period = query_analysis.get('time_period', {})
        if time_period.get('type') != 'all':
            for rec in recommendations:
                rec['time_context'] = time_period.get('display', '')
        
        # Add detailed context info
        for rec in recommendations:
            rec['context_used'] = detailed_context
        
        return recommendations[:3]  # Return top 3
    
    def _filter_by_data(self, recommendations: List[Dict], 
                        data_chars: Dict[str, Any]) -> List[Dict]:
        """
        Filter recommendations based on data characteristics.
        """
        filtered = recommendations.copy()
        
        # Filter by data size
        data_size = data_chars.get('size', 0)
        if data_size > 100:
            # Prefer aggregated visualizations for large datasets
            filtered = [r for r in filtered if r['viz_type'] not in ['sparkline', 'bullet_chart']]
        elif data_size < 10:
            # Prefer detailed visualizations for small datasets
            filtered = [r for r in filtered if r['viz_type'] not in ['dashboard', 'heatmap']]
        
        # Filter by data type
        data_type = data_chars.get('type', 'numeric')
        if data_type == 'categorical':
            filtered = [r for r in filtered if r['viz_type'] not in ['line_chart', 'area_chart']]
        
        return filtered
    
    def get_best_visualization(self, query_analysis: Dict[str, Any],
                               data_characteristics: Dict[str, Any] = None) -> str:
        """
        Get the single best visualization type for the query.
        PRIORITY: If user explicitly mentions a chart type in query, use that.
        Otherwise, use intelligent selection based on intent and context.

        Args:
            query_analysis: Result from analyze_query()
            data_characteristics: Optional data characteristics

        Returns:
            Best visualization type name
        """
        # First, check if user explicitly specified a chart type in the query
        query = query_analysis.get('original_query', '')
        explicit_chart_type = self.extract_chart_type_from_query(query)
        
        if explicit_chart_type:
            # User explicitly requested this chart type - use it
            return explicit_chart_type
        
        # No explicit chart type mentioned - use intelligent selection
        recommendations = self.select_visualization(query_analysis, data_characteristics)

        if not recommendations:
            return 'line_chart'  # Default fallback

        # Use query hash to deterministically select different viz types for diversity
        hash_val = self._get_query_hash(query)

        # Pick different viz type based on hash for diversity
        index = hash_val % len(recommendations)

        return recommendations[index]['viz_type']
    
    def explain_selection(self, viz_type: str, query_analysis: Dict[str, Any]) -> str:
        """
        Explain why a particular visualization was selected.
        
        Args:
            viz_type: The visualization type
            query_analysis: The query analysis result
        
        Returns:
            Human-readable explanation
        """
        intent = query_analysis['intent']
        time_period = query_analysis.get('time_period', {})
        
        explanations = {
            'line_chart': f"Selected because it's best for showing {intent} over time",
            'bar_chart': f"Selected for clear comparison of {intent} values",
            'pie_chart': f"Selected to show proportional distribution",
            'area_chart': f"Selected to emphasize cumulative {intent} patterns",
            'dashboard': f"Selected for comprehensive overview of {intent}",
            'kpi_gauge': f"Selected to display key metrics at a glance",
            'heatmap': f"Selected to show patterns across {time_period.get('display', 'time')}",
            'radar_chart': f"Selected for multi-dimensional {intent} comparison"
        }
        
        return explanations.get(viz_type, f"Selected as best fit for {intent} intent")
    
    def extract_chart_type_from_query(self, query: str) -> Optional[str]:
        """
        Extract the chart type directly from the user's query.
        E.g., "show me in area chart" -> 'area_chart'
        
        Args:
            query: User's natural language query
        
        Returns:
            Chart type if found, None otherwise
        """
        query_lower = query.lower()
        
        for viz_type, keywords in self.chart_type_keywords.items():
            for keyword in keywords:
                if keyword in query_lower:
                    return viz_type
        
        return None


# Convenience function for quick selection
def select_best_visualization(query: str, intent: str = None,
                               data_characteristics: Dict = None) -> Dict[str, Any]:
    """
    Convenience function to select the best visualization for a query.
    
    Args:
        query: User's natural language query
        intent: Optional pre-classified intent
        data_characteristics: Optional data characteristics
    
    Returns:
        Dictionary with selected visualization and analysis
    """
    selector = VisualizationSelector()
    
    # Analyze the query
    query_analysis = selector.analyze_query(query, intent)
    
    # Get recommendations
    recommendations = selector.select_visualization(query_analysis, data_characteristics)
    
    # Get best visualization
    best_viz = selector.get_best_visualization(query_analysis, data_characteristics)
    
    # Get explanation
    explanation = selector.explain_selection(best_viz, query_analysis)
    
    return {
        'query_analysis': query_analysis,
        'recommendations': recommendations,
        'best_visualization': best_viz,
        'explanation': explanation
    }


if __name__ == "__main__":
    # Test the visualization selector
    print("=" * 70)
    print("VISUALIZATION SELECTOR TEST")
    print("=" * 70)
    
    selector = VisualizationSelector()
    
    # Test queries
    test_queries = [
        ("What will be the sales next quarter?", "prediction"),
        ("Compare revenue between regions", "compare"),
        ("Show me the trend in customer acquisition", "trend"),
        ("Give me an executive summary", "summarise"),
        ("Predict sales for March", "prediction"),
        ("Compare revenue for Q1", "compare"),
        ("Trend in January", "trend"),
        ("Summarize for December", "summarise")
    ]
    
    for query, intent in test_queries:
        print(f"\n{'='*70}")
        print(f"Query: '{query}'")
        print(f"Intent: {intent}")
        
        result = select_best_visualization(query, intent)
        
        print(f"\nTime Period: {result['query_analysis']['time_period']}")
        print(f"Context: {result['query_analysis']['context']}")
        print(f"\nBest Visualization: {result['best_visualization']}")
        print(f"Explanation: {result['explanation']}")
        
        print(f"\nRecommendations:")
        for i, rec in enumerate(result['recommendations'], 1):
            print(f"  {i}. {rec['viz_type']}: {rec['reason']}")
            if 'time_context' in rec:
                print(f"     Time Context: {rec['time_context']}")
    
    print("\n" + "=" * 70)
    print("VISUALIZATION SELECTOR TEST COMPLETE")
    print("=" * 70)
