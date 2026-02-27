"""
Visualization Catalog Module
Defines 35+ visualization types organized by category.
Each visualization has metadata, best use cases, and summary templates.
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from enum import Enum


class VizCategory(Enum):
    """Enumeration of visualization categories."""
    TIME_SERIES = "time_series"
    COMPARISONS = "comparisons"
    DISTRIBUTIONS = "distributions"
    CORRELATIONS = "correlations"
    COMPOSITIONS = "compositions"
    KPI_DASHBOARD = "kpi_dashboard"


@dataclass
class VisualizationType:
    """
    Data class representing a visualization type.
    
    Attributes:
        name: Unique identifier for the visualization
        category: Category the visualization belongs to
        display_name: Human-readable name
        description: What this visualization shows
        best_for: List of use cases this viz is best suited for
        required_data: Data characteristics needed
        summary_template: Template for generating text summaries
        intent_match: Which intents this viz works best with
        complexity: Difficulty level (simple, medium, complex)
        icon: Emoji or icon representation
    """
    name: str
    category: VizCategory
    display_name: str
    description: str
    best_for: List[str]
    required_data: Dict[str, Any]
    summary_template: str
    intent_match: List[str]
    complexity: str = "medium"
    icon: str = "📊"


class VisualizationCatalog:
    """
    Catalog of all 35+ visualization types with metadata and selection logic.
    """
    
    def __init__(self):
        self.visualizations: Dict[str, VisualizationType] = {}
        self._initialize_catalog()
    
    def _initialize_catalog(self):
        """Initialize all 35+ visualization types."""
        
        # ==================== TIME SERIES (8 types) ====================
        
        self.visualizations['line_chart'] = VisualizationType(
            name='line_chart',
            category=VizCategory.TIME_SERIES,
            display_name='Line Chart',
            description='Shows trends over time with connected data points',
            best_for=[
                'Time series data',
                'Trend analysis',
                'Continuous data over time',
                'Forecasting results'
            ],
            required_data={
                'min_points': 2,
                'time_based': True,
                'numeric_y': True,
                'categorical_x': False
            },
            summary_template="Trend shows {trend_direction} pattern with {change_percent}% change over {periods} periods. Peak: {peak_value}",
            intent_match=['prediction', 'trend', 'forecast'],
            complexity='simple',
            icon='📈'
        )
        
        self.visualizations['area_chart'] = VisualizationType(
            name='area_chart',
            category=VizCategory.TIME_SERIES,
            display_name='Area Chart',
            description='Filled area under line emphasizing volume/magnitude',
            best_for=[
                'Cumulative values over time',
                'Volume trends',
                'Stacked contributions',
                'Emphasizing magnitude'
            ],
            required_data={
                'min_points': 2,
                'time_based': True,
                'numeric_y': True,
                'categorical_x': False
            },
            summary_template="Cumulative trend shows {trend_direction} trajectory with total volume of {total_value}. Growth rate: {growth_rate}%",
            intent_match=['prediction', 'trend', 'summarise'],
            complexity='simple',
            icon='🗻'
        )
        
        self.visualizations['stacked_area'] = VisualizationType(
            name='stacked_area',
            category=VizCategory.TIME_SERIES,
            display_name='Stacked Area Chart',
            description='Multiple series stacked to show part-to-whole over time',
            best_for=[
                'Part-to-whole over time',
                'Multiple categories contribution',
                'Composition trends',
                'Market share evolution'
            ],
            required_data={
                'min_points': 2,
                'time_based': True,
                'numeric_y': True,
                'multiple_series': True,
                'categorical_x': False
            },
            summary_template="Stacked composition shows {top_category} as largest contributor ({top_percent}%). Total growth: {total_growth}%",
            intent_match=['compare', 'trend', 'summarise'],
            complexity='medium',
            icon='🥞'
        )
        
        self.visualizations['multi_line'] = VisualizationType(
            name='multi_line',
            category=VizCategory.TIME_SERIES,
            display_name='Multi-Line Chart',
            description='Multiple lines comparing trends across categories',
            best_for=[
                'Comparing multiple trends',
                'Category performance over time',
                'Benchmark comparisons',
                'Competitive analysis'
            ],
            required_data={
                'min_points': 2,
                'time_based': True,
                'numeric_y': True,
                'multiple_series': True,
                'categorical_x': False
            },
            summary_template="{winner} leads with {winner_value}, outperforming {loser} by {difference}%. All series show {overall_trend} trend",
            intent_match=['compare', 'trend', 'prediction'],
            complexity='medium',
            icon='📉'
        )
        
        self.visualizations['candlestick'] = VisualizationType(
            name='candlestick',
            category=VizCategory.TIME_SERIES,
            display_name='Candlestick Chart',
            description='OHLC (Open-High-Low-Close) financial chart',
            best_for=[
                'Financial data',
                'Stock prices',
                'Price volatility',
