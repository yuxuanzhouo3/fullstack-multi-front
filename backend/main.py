from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Dict, List, Optional
import jwt
import redis
import json
import uuid
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Multi-Tenant API",
    description="Shared API backend for 1000 frontend applications",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

# JWT secret
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")

# Security
security = HTTPBearer()

# Pydantic models
class UserLogin(BaseModel):
    username: str
    password: str
    product_id: str

class ProductConfig(BaseModel):
    product_id: str
    theme: str
    features: List[str]

class ApiResponse(BaseModel):
    success: bool
    data: Optional[Dict] = None
    message: Optional[str] = None

# Product configurations (same as Node.js server)
PRODUCTS = {
    'product-1': {
        'name': 'E-Commerce Platform',
        'theme': 'blue',
        'features': ['shopping-cart', 'payment', 'inventory'],
        'api_endpoint': 'http://localhost:8001/api'
    },
    'product-2': {
        'name': 'CRM System',
        'theme': 'green',
        'features': ['contacts', 'leads', 'analytics'],
        'api_endpoint': 'http://localhost:8002/api'
    },
    'product-3': {
        'name': 'Project Management',
        'theme': 'purple',
        'features': ['tasks', 'timeline', 'collaboration'],
        'api_endpoint': 'http://localhost:8003/api'
    }
}

# Generate 1000 products
for i in range(4, 1001):
    themes = ['blue', 'green', 'purple', 'orange', 'red', 'teal', 'pink', 'indigo']
    feature_sets = [
        ['analytics', 'dashboard', 'reports'],
        ['messaging', 'notifications', 'chat'],
        ['file-management', 'storage', 'sharing'],
        ['user-management', 'roles', 'permissions'],
        ['billing', 'subscriptions', 'payments'],
        ['workflow', 'automation', 'integrations']
    ]
    
    PRODUCTS[f'product-{i}'] = {
        'name': f'Business Solution {i}',
        'theme': themes[i % len(themes)],
        'features': feature_sets[i % len(feature_sets)],
        'api_endpoint': f'http://localhost:{8000 + i}/api'
    }

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

# Product access validation
async def validate_product_access(product_id: str, user: Dict = Depends(get_current_user)):
    user_session = redis_client.get(f"session:{user['id']}")
    if user_session:
        session = json.loads(user_session)
        if session.get('current_product') != product_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this product"
            )
    return product_id

# Routes
@app.get("/")
async def root():
    return {
        "message": "Multi-Tenant API Backend",
        "version": "1.0.0",
        "products_count": len(PRODUCTS)
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "redis_connected": redis_client.ping()
    }

@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    if not user_data.username or not user_data.password or not user_data.product_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required fields"
        )
    
    if user_data.product_id not in PRODUCTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Simple authentication (in production, validate against database)
    if user_data.username == "admin" and user_data.password == "password123":
        user_id = str(uuid.uuid4())
        token = jwt.encode(
            {
                "id": user_id,
                "username": user_data.username,
                "product_id": user_data.product_id,
                "exp": datetime.utcnow() + timedelta(hours=24)
            },
            JWT_SECRET,
            algorithm="HS256"
        )
        
        # Store session
        session_data = {
            "current_product": user_data.product_id,
            "login_time": datetime.now().isoformat()
        }
        redis_client.set(f"session:{user_id}", json.dumps(session_data), ex=86400)
        
        return {
            "token": token,
            "product": PRODUCTS[user_data.product_id],
            "user_id": user_id
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

@app.get("/api/{product_id}/config")
async def get_product_config(
    product_id: str = Depends(validate_product_access),
    user: Dict = Depends(get_current_user)
):
    if product_id not in PRODUCTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return {
        "product": PRODUCTS[product_id],
        "shared_resources": {
            "node_modules": "/shared/node_modules",
            "common_styles": "/shared/styles",
            "common_scripts": "/shared/scripts"
        },
        "user": {
            "id": user["id"],
            "username": user["username"]
        }
    }

@app.get("/api/{product_id}/data")
async def get_product_data(
    product_id: str = Depends(validate_product_access),
    user: Dict = Depends(get_current_user)
):
    """Get product-specific data"""
    if product_id not in PRODUCTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Generate mock data based on product features
    product = PRODUCTS[product_id]
    mock_data = {
        "dashboard": {
            "metrics": {
                "users": 1250,
                "revenue": 45000,
                "growth": 12.5
            },
            "recent_activity": [
                {"action": "User login", "timestamp": datetime.now().isoformat()},
                {"action": "Data update", "timestamp": datetime.now().isoformat()}
            ]
        },
        "features": product["features"],
        "theme": product["theme"]
    }
    
    return mock_data

@app.post("/api/{product_id}/action")
async def perform_action(
    action: str,
    data: Dict,
    product_id: str = Depends(validate_product_access),
    user: Dict = Depends(get_current_user)
):
    """Perform product-specific actions"""
    if product_id not in PRODUCTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Log action
    action_log = {
        "user_id": user["id"],
        "product_id": product_id,
        "action": action,
        "data": data,
        "timestamp": datetime.now().isoformat()
    }
    
    # Store in Redis for analytics
    redis_client.lpush(f"actions:{product_id}", json.dumps(action_log))
    redis_client.ltrim(f"actions:{product_id}", 0, 999)  # Keep last 1000 actions
    
    return {
        "success": True,
        "message": f"Action '{action}' performed successfully",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/shared/resources")
async def get_shared_resources():
    """Get shared resources information"""
    return {
        "node_modules": {
            "path": "/shared/node_modules",
            "size": "2.5GB",
            "packages": 1500
        },
        "common_styles": {
            "path": "/shared/styles",
            "themes": ["blue", "green", "purple", "orange", "red", "teal", "pink", "indigo"]
        },
        "common_scripts": {
            "path": "/shared/scripts",
            "utilities": ["auth", "validation", "api", "ui"]
        }
    }

@app.get("/api/analytics/usage")
async def get_usage_analytics():
    """Get usage analytics across all products"""
    analytics = {}
    
    for product_id in PRODUCTS.keys():
        # Get action count from Redis
        action_count = redis_client.llen(f"actions:{product_id}")
        analytics[product_id] = {
            "actions_count": action_count,
            "name": PRODUCTS[product_id]["name"],
            "theme": PRODUCTS[product_id]["theme"]
        }
    
    return {
        "total_products": len(PRODUCTS),
        "total_actions": sum(data["actions_count"] for data in analytics.values()),
        "products": analytics
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 