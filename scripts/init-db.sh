#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="development"

# Usage info
function usage() {
  echo "Initialize database for TixGenius"
  echo
  echo "Usage: $0 [options]"
  echo
  echo "Options:"
  echo "  -e, --environment <env>    Target environment: development, staging, production (default: development)"
  echo "  -h, --help                 Show this help message"
  echo
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -e|--environment)
      ENVIRONMENT="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      usage
      exit 1
      ;;
  esac
done

# Validate environment
if [[ "$ENVIRONMENT" != "development" && "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
  echo -e "${RED}Invalid environment: $ENVIRONMENT${NC}"
  usage
  exit 1
fi

echo -e "${GREEN}Initializing TixGenius database for $ENVIRONMENT...${NC}"

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
  echo -e "${GREEN}Loading environment variables from .env.$ENVIRONMENT${NC}"
  export $(grep -v '^#' .env.$ENVIRONMENT | xargs)
elif [ -f ".env" ]; then
  echo -e "${YELLOW}Warning: .env.$ENVIRONMENT not found, using .env instead${NC}"
  export $(grep -v '^#' .env | xargs)
else
  echo -e "${RED}Error: No .env file found${NC}"
  exit 1
fi

# Check if Prisma is installed
if ! command -v npx &> /dev/null; then
  echo -e "${RED}Error: npx is not installed. Please install Node.js and npm.${NC}"
  exit 1
fi

# Navigate to backend directory
cd apps/backend

# Generate Prisma client
echo -e "${GREEN}Generating Prisma client...${NC}"
npx prisma generate

# Apply migrations
echo -e "${GREEN}Applying database migrations...${NC}"
if [[ "$ENVIRONMENT" == "production" || "$ENVIRONMENT" == "staging" ]]; then
  npx prisma migrate deploy
else
  npx prisma migrate dev
fi

# Seed database (only in development)
if [[ "$ENVIRONMENT" == "development" ]]; then
  echo -e "${GREEN}Seeding database...${NC}"
  npx prisma db seed
else
  echo -e "${YELLOW}Skipping database seed in $ENVIRONMENT environment${NC}"
fi

echo -e "${GREEN}Database initialization complete!${NC}"
exit 0 