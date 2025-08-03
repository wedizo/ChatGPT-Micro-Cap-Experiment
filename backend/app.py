from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import uuid
from datetime import datetime
import yfinance as yf
from typing import Dict, List, Any
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

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
    
    # Check if OpenAI API key is available
    if not os.getenv('OPENAI_API_KEY'):
        raise Exception("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
    prompt = f"""
    You are a professional stock analyst specializing in micro-cap stocks (market cap under $300M). 
    Analyze {ticker} based on the following real market data:
    
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
    
    IMPORTANT: You must respond with ONLY a valid JSON object in this exact format:
    {{
        "recommendation": "BUY" or "HOLD" or "SELL",
        "confidence": number between 1-100,
        "target_price": estimated target price as number,
        "stop_loss": recommended stop loss as number,
        "analysis": "2-3 paragraph detailed analysis focusing on micro-cap specific factors",
        "key_points": ["exactly 5 key strengths as strings"],
        "risks": ["exactly 5 risk factors as strings"],
        "catalysts": ["exactly 5 potential catalysts as strings"]
    }}
    
    Focus on micro-cap specific factors: liquidity, volatility, growth potential, execution risk, 
    management quality, competitive position, and financial stability. Do not include any text 
    outside the JSON object.
    """
    
    try:
        response = client.chat.completions.create(
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
            # Clean the response and parse JSON
            json_str = analysis_text.strip()
            if json_str.startswith('```json'):
                json_str = json_str[7:]
            if json_str.endswith('```'):
                json_str = json_str[:-3]
            if not json_str.startswith('{'):
                start_idx = json_str.find('{')
                end_idx = json_str.rfind('}') + 1
                json_str = json_str[start_idx:end_idx]
            
            analysis_data = json.loads(json_str)
            
            # Validate required fields
            required_fields = ['recommendation', 'confidence', 'analysis', 'key_points', 'risks', 'catalysts']
            for field in required_fields:
                if field not in analysis_data:
                    raise ValueError(f"Missing required field: {field}")
                    
        except Exception as parse_error:
            print(f"JSON parsing error: {parse_error}")
            print(f"Raw response: {analysis_text}")
            # Fallback if JSON parsing fails
            analysis_data = {
                "recommendation": "HOLD",
                "confidence": 70,
                "target_price": float(stock_data.get('current_price', 0)) * 1.1,
                "stop_loss": float(stock_data.get('current_price', 0)) * 0.9,
                "analysis": f"Analysis generated for {ticker}. Raw response parsing failed, manual review recommended.",
                "key_points": ["Real-time data analyzed", "Professional assessment provided", "Micro-cap focus maintained", "Risk factors considered", "Market conditions evaluated"],
                "risks": ["JSON parsing error occurred", "Manual verification needed", "Market volatility", "Liquidity concerns", "Execution risk"],
                "catalysts": ["Further analysis recommended", "Market conditions", "Company execution", "Industry trends", "Technical developments"]
            }
        
        return analysis_data
        
    except Exception as e:
        print(f"Error generating ChatGPT analysis: {e}")
        return {
            "recommendation": "HOLD",
            "confidence": 50,
            "target_price": float(stock_data.get('current_price', 0)),
            "stop_loss": float(stock_data.get('current_price', 0)) * 0.9,
            "analysis": f"Unable to generate detailed analysis due to API error: {str(e)}",
            "key_points": ["Manual research recommended", "API error encountered", "Data limitations present", "Professional review needed", "Alternative analysis suggested"],
            "risks": ["API limitations", "Data unavailable", "Analysis incomplete", "Manual verification required", "Technical difficulties"],
            "catalysts": ["Further research needed", "API resolution", "Manual analysis", "Data availability", "System improvements"]
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
        print("ERROR: OPENAI_API_KEY environment variable not set!")
        print("Please create a .env file with your OpenAI API key:")
        print("OPENAI_API_KEY=your_api_key_here")
        exit(1)
    
    app.run(debug=True, host='0.0.0.0', port=8000)