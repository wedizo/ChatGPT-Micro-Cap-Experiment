from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import openai
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Load OpenAI API key from environment
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/api/research', methods=['POST'])
def generate_research():
    try:
        data = request.json
        ticker = data.get('ticker', '').upper()
        analysis_type = data.get('analysisType', 'comprehensive')
        timeframe = data.get('timeframe', '6 months')
        
        if not ticker:
            return jsonify({'error': 'Ticker is required'}), 400
            
        # For demo purposes, simulate different recommendations based on ticker
        # This allows us to test the BUY filter functionality
        mock_responses = {
            'AAPL': {
                "recommendation": "BUY",
                "confidence": 85,
                "target_price": 190.0,
                "stop_loss": 160.0,
                "key_strengths": ["Strong brand loyalty", "Innovation pipeline", "Solid financials"],
                "risk_factors": ["Market saturation", "Regulatory pressures", "Supply chain risks"],
                "catalysts": ["New product launches", "Services growth"],
                "analysis": "Apple shows strong fundamentals with excellent cash flow generation and a loyal customer base. The company's ecosystem creates significant switching costs and recurring revenue opportunities."
            },
            'TSLA': {
                "recommendation": "HOLD",
                "confidence": 65,
                "target_price": 250.0,
                "stop_loss": 180.0,
                "key_strengths": ["EV market leader", "Vertical integration", "Energy business"],
                "risk_factors": ["Valuation concerns", "Competition increasing", "Execution risks"],
                "catalysts": ["FSD deployment", "Energy storage growth"],
                "analysis": "Tesla remains the EV leader but faces increasing competition. Valuation appears stretched relative to near-term fundamentals, suggesting a more cautious stance."
            },
            'ABEO': {
                "recommendation": "BUY",
                "confidence": 75,
                "target_price": 12.50,
                "stop_loss": 8.00,
                "key_strengths": ["Gene therapy pipeline", "Rare disease focus", "Recent approvals"],
                "risk_factors": ["Clinical trial risks", "Regulatory hurdles", "Limited cash runway"],
                "catalysts": ["Pipeline developments", "Partnership opportunities"],
                "analysis": "Abeona Therapeutics presents compelling micro-cap opportunity in gene therapy space with recent product launches showing promise for revenue growth."
            },
            'DEFAULT': {
                "recommendation": "SELL",
                "confidence": 45,
                "target_price": 50.0,
                "stop_loss": 55.0,
                "key_strengths": ["Market presence", "Brand recognition", "Operational efficiency"],
                "risk_factors": ["Declining margins", "Market headwinds", "Competitive pressure"],
                "catalysts": ["Cost reduction initiatives", "Market recovery"],
                "analysis": "The company faces significant headwinds with declining fundamentals and increasing competitive pressure suggesting a cautious approach."
            }
        }
        
        # Get mock response (use DEFAULT if ticker not found)
        analysis_data = mock_responses.get(ticker, mock_responses['DEFAULT'])
        
        # Add metadata
        result = {
            **analysis_data,
            "id": f"{ticker}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "ticker": ticker,
            "current_price": 100.0,  # Mock price
            "timestamp": datetime.now().isoformat(),
            "analysis_type": analysis_type,
            "timeframe": timeframe,
            "keyPoints": analysis_data["key_strengths"],  # Map to expected field name
            "risks": analysis_data["risk_factors"],  # Map to expected field name
            "catalysts": analysis_data["catalysts"],
            "targetPrice": analysis_data["target_price"],  # Map to expected field name
            "stopLoss": analysis_data["stop_loss"]  # Map to expected field name
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/research/history', methods=['GET'])
def get_research_history():
    # For now, return empty history
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True, port=8000)