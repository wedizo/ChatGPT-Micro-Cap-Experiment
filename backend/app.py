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
            
        # Fetch stock data
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period='1y')
        
        if hist.empty:
            return jsonify({'error': f'No data found for ticker {ticker}'}), 404
            
        current_price = hist['Close'].iloc[-1]
        
        # Create prompt for ChatGPT
        prompt = f"""
        Analyze the stock {ticker} for a {timeframe} investment timeframe.
        
        Current stock price: ${current_price:.2f}
        Analysis type: {analysis_type}
        
        Company info: {json.dumps(info, default=str)[:1000]}
        
        Please provide a comprehensive analysis in JSON format with these exact fields:
        {{
            "recommendation": "BUY" or "HOLD" or "SELL",
            "confidence": number between 0-100,
            "target_price": number,
            "stop_loss": number,
            "key_strengths": ["strength1", "strength2", "strength3"],
            "risk_factors": ["risk1", "risk2", "risk3"],
            "catalysts": ["catalyst1", "catalyst2"],
            "analysis": "detailed written analysis"
        }}
        
        Focus on micro-cap and small-cap investment considerations.
        """
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional stock analyst specializing in micro-cap and small-cap stocks."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.7
        )
        
        # Parse the response
        ai_response = response.choices[0].message.content
        
        try:
            # Try to extract JSON from the response
            start_idx = ai_response.find('{')
            end_idx = ai_response.rfind('}') + 1
            json_str = ai_response[start_idx:end_idx]
            analysis_data = json.loads(json_str)
        except:
            # Fallback if JSON parsing fails
            analysis_data = {
                "recommendation": "HOLD",
                "confidence": 50,
                "target_price": current_price * 1.1,
                "stop_loss": current_price * 0.9,
                "key_strengths": ["Analysis generated", "Real market data", "AI powered"],
                "risk_factors": ["Market volatility", "Micro-cap risks", "Limited liquidity"],
                "catalysts": ["Market conditions", "Company developments"],
                "analysis": ai_response
            }
        
        # Add metadata
        result = {
            **analysis_data,
            "ticker": ticker,
            "current_price": current_price,
            "timestamp": datetime.now().isoformat(),
            "analysis_type": analysis_type,
            "timeframe": timeframe
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