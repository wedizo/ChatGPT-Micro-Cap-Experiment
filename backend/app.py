from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import json
import uuid
from datetime import datetime
import yfinance as yf
from typing import Dict, List, Any

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# In-memory storage for research results (in production, use a database)
research_history: List[Dict[str, Any]] = []

def get_stock_data(ticker: str) -> Dict[str, Any]:
    """Fetch basic stock data using yfinance"""
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period="1y")
        
        return {
            'ticker': ticker,
            'current_price': info.get('currentPrice', 0),
            'market_cap': info.get('marketCap', 0),
            'pe_ratio': info.get('trailingPE', 0),
            'revenue': info.get('totalRevenue', 0),
            'sector': info.get('sector', 'Unknown'),
            'industry': info.get('industry', 'Unknown'),
            'year_high': hist['High'].max() if not hist.empty else 0,
            'year_low': hist['Low'].min() if not hist.empty else 0,
            'volume': info.get('volume', 0),
            'description': info.get('longBusinessSummary', ''),
        }
    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")
        return {'ticker': ticker, 'error': str(e)}

def generate_chatgpt_analysis(ticker: str, stock_data: Dict[str, Any], analysis_type: str, timeframe: str) -> Dict[str, Any]:
    """Generate stock analysis using ChatGPT"""
    
    prompt = f"""
    You are a professional stock analyst specializing in micro-cap stocks. Analyze {ticker} based on the following data:
    
    Stock Data:
    - Current Price: ${stock_data.get('current_price', 'N/A')}
    - Market Cap: ${stock_data.get('market_cap', 'N/A'):,}
    - P/E Ratio: {stock_data.get('pe_ratio', 'N/A')}
    - Sector: {stock_data.get('sector', 'N/A')}
    - Industry: {stock_data.get('industry', 'N/A')}
    - 52-Week High: ${stock_data.get('year_high', 'N/A')}
    - 52-Week Low: ${stock_data.get('year_low', 'N/A')}
    - Description: {stock_data.get('description', 'N/A')[:500]}...
    
    Analysis Type: {analysis_type}
    Investment Timeframe: {timeframe}
    
    Please provide a comprehensive analysis including:
    1. Overall assessment and recommendation (BUY/HOLD/SELL)
    2. Confidence level (0-100%)
    3. Key strengths (5 bullet points)
    4. Risk factors (5 bullet points)
    5. Potential catalysts (5 bullet points)
    6. Target price estimate
    7. Stop-loss recommendation
    8. Detailed analysis (2-3 paragraphs)
    
    Focus on micro-cap specific factors like liquidity, volatility, growth potential, and execution risk.
    
    Format your response as JSON with the following structure:
    {{
        "recommendation": "BUY/HOLD/SELL",
        "confidence": 85,
        "target_price": 25.50,
        "stop_loss": 18.00,
        "analysis": "Detailed analysis text...",
        "key_points": ["Point 1", "Point 2", ...],
        "risks": ["Risk 1", "Risk 2", ...],
        "catalysts": ["Catalyst 1", "Catalyst 2", ...]
    }}
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional micro-cap stock analyst. Provide detailed, actionable investment analysis."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.7
        )
        
        # Parse the JSON response
        analysis_text = response.choices[0].message.content
        
        # Try to extract JSON from the response
        try:
            # Find JSON in the response
            start_idx = analysis_text.find('{')
            end_idx = analysis_text.rfind('}') + 1
            json_str = analysis_text[start_idx:end_idx]
            analysis_data = json.loads(json_str)
        except:
            # Fallback if JSON parsing fails
            analysis_data = {
                "recommendation": "HOLD",
                "confidence": 70,
                "target_price": stock_data.get('current_price', 0) * 1.2,
                "stop_loss": stock_data.get('current_price', 0) * 0.85,
                "analysis": analysis_text,
                "key_points": ["Analysis generated", "Review recommended", "Data limitations noted"],
                "risks": ["Market volatility", "Liquidity concerns", "Execution risk"],
                "catalysts": ["Market conditions", "Company execution", "Industry trends"]
            }
        
        return analysis_data
        
    except Exception as e:
        print(f"Error generating ChatGPT analysis: {e}")
        return {
            "recommendation": "HOLD",
            "confidence": 50,
            "target_price": stock_data.get('current_price', 0),
            "stop_loss": stock_data.get('current_price', 0) * 0.9,
            "analysis": f"Unable to generate detailed analysis due to API error: {str(e)}",
            "key_points": ["Manual research recommended"],
            "risks": ["API limitations", "Data unavailable"],
            "catalysts": ["Further research needed"]
        }

@app.route('/api/research', methods=['POST'])
def research_stock():
    """Generate AI research for a stock"""
    try:
        data = request.get_json()
        ticker = data.get('ticker', '').upper()
        analysis_type = data.get('analysisType', 'comprehensive')
        timeframe = data.get('timeframe', '3months')
        
        if not ticker:
            return jsonify({'error': 'Ticker is required'}), 400
        
        # Get stock data
        stock_data = get_stock_data(ticker)
        
        if 'error' in stock_data:
            return jsonify({'error': f'Unable to fetch data for {ticker}'}), 400
        
        # Generate ChatGPT analysis
        analysis = generate_chatgpt_analysis(ticker, stock_data, analysis_type, timeframe)
        
        # Create research result
        result = {
            'id': str(uuid.uuid4()),
            'ticker': ticker,
            'timestamp': datetime.now().isoformat(),
            'analysisType': analysis_type,
            'timeframe': timeframe,
            'recommendation': analysis.get('recommendation', 'HOLD').lower(),
            'confidence': analysis.get('confidence', 70),
            'targetPrice': analysis.get('target_price', 0),
            'stopLoss': analysis.get('stop_loss', 0),
            'analysis': analysis.get('analysis', ''),
            'keyPoints': analysis.get('key_points', []),
            'risks': analysis.get('risks', []),
            'catalysts': analysis.get('catalysts', [])
        }
        
        # Store in history
        research_history.append(result)
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Research endpoint error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/research/history', methods=['GET'])
def get_research_history():
    """Get research history"""
    return jsonify(research_history)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    # Check for OpenAI API key
    if not os.getenv('OPENAI_API_KEY'):
        print("Warning: OPENAI_API_KEY environment variable not set")
    
    app.run(debug=True, host='0.0.0.0', port=8000)