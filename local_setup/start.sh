#!/bin/bash

# Multi-Tenant System Startup Script
echo "🚀 Starting Multi-Tenant System..."

# Function to find first available port starting from given port
find_available_port() {
    local start_port=$1
    local end_port=$2
    local port=$start_port
    while [ $port -le $end_port ]; do
        if ! lsof -i :$port > /dev/null 2>&1; then
            echo $port
            return 0
        fi
        port=$((port + 1))
    done
    echo "No available ports found between $start_port-$end_port"
    exit 1
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please ensure Docker Desktop is running."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p shared/node_modules shared/styles shared/scripts apps logs

# Find available backend port
echo "🔍 Finding available backend port..."
BACKEND_PORT=$(find_available_port 8000 8100)
echo "✅ Using backend port: $BACKEND_PORT"

# Find available Redis port
echo "🔍 Finding available Redis port..."
REDIS_PORT=$(find_available_port 6379 6479)
echo "✅ Using Redis port: $REDIS_PORT"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Multi-Tenant System Environment Variables
NODE_ENV=production
PORT=3000
BACKEND_PORT=$BACKEND_PORT
REDIS_URL=redis://localhost:$REDIS_PORT
MONGODB_URI=mongodb://admin:password123@localhost:27017/multi-tenant
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Backend API
REDIS_HOST=localhost
REDIS_PORT=$REDIS_PORT

# Database
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=multi-tenant
EOF
else
    # Update existing .env with new ports
    echo "📝 Updating .env file with backend port: $BACKEND_PORT and Redis port: $REDIS_PORT"
    sed -i '' "s/BACKEND_PORT=.*/BACKEND_PORT=$BACKEND_PORT/" .env 2>/dev/null || echo "BACKEND_PORT=$BACKEND_PORT" >> .env
    sed -i '' "s/REDIS_URL=.*/REDIS_URL=redis:\/\/localhost:$REDIS_PORT/" .env 2>/dev/null || echo "REDIS_URL=redis://localhost:$REDIS_PORT" >> .env
    sed -i '' "s/REDIS_PORT=.*/REDIS_PORT=$REDIS_PORT/" .env 2>/dev/null || echo "REDIS_PORT=$REDIS_PORT" >> .env
fi

# Build and start services
echo "🔨 Building Docker images..."
cd docker
docker compose build

echo "🚀 Starting services..."
PORT=$BACKEND_PORT REDIS_PORT=$REDIS_PORT docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

# Check Node.js server
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Node.js server is running on http://localhost:3000"
else
    echo "❌ Node.js server is not responding"
fi

# Check Python backend
if curl -f http://localhost:$BACKEND_PORT/health > /dev/null 2>&1; then
    echo "✅ Python FastAPI backend is running on http://localhost:$BACKEND_PORT"
else
    echo "❌ Python FastAPI backend is not responding"
fi

# Check Redis
if docker compose exec redis redis-cli -p $REDIS_PORT ping > /dev/null 2>&1; then
    echo "✅ Redis is running on port $REDIS_PORT"
else
    echo "❌ Redis is not responding"
fi

# Check MongoDB
if docker compose exec mongo mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not responding"
fi

echo ""
echo "🎉 Multi-Tenant System is ready!"
echo ""
echo "📊 System Information:"
echo "   • Frontend Server: http://localhost:3000"
echo "   • Backend API: http://localhost:$BACKEND_PORT"
echo "   • API Documentation: http://localhost:$BACKEND_PORT/docs"
echo "   • Redis: localhost:$REDIS_PORT"
echo "   • Health Check: http://localhost:3000/health"
echo ""
echo "🔑 Default Login Credentials:"
echo "   • Username: admin"
echo "   • Password: password123"
echo ""
echo "📱 Sample Products:"
echo "   • E-Commerce: http://localhost:3000/product-1"
echo "   • CRM System: http://localhost:3000/product-2"
echo "   • Project Management: http://localhost:3000/product-3"
echo ""
echo "🛠️  Management Commands:"
echo "   • View logs: docker compose logs -f"
echo "   • Stop services: docker compose down"
echo "   • Restart services: docker compose restart"
echo "   • Rebuild: docker compose up --build"
echo ""

# Show running containers
echo "🐳 Running Containers:"
docker compose ps 