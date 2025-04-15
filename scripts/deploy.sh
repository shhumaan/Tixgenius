#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="development"
DEPLOY_TARGET="docker"

# Usage info
function usage() {
  echo "Deploy TixGenius application"
  echo
  echo "Usage: $0 [options]"
  echo
  echo "Options:"
  echo "  -e, --environment <env>    Target environment: development, staging, production (default: development)"
  echo "  -t, --target <target>      Deploy target: docker, aws, gcp, azure, k8s (default: docker)"
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
    -t|--target)
      DEPLOY_TARGET="$2"
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

# Validate target
if [[ "$DEPLOY_TARGET" != "docker" && "$DEPLOY_TARGET" != "aws" && "$DEPLOY_TARGET" != "gcp" && "$DEPLOY_TARGET" != "azure" && "$DEPLOY_TARGET" != "k8s" ]]; then
  echo -e "${RED}Invalid deploy target: $DEPLOY_TARGET${NC}"
  usage
  exit 1
fi

echo -e "${GREEN}Deploying TixGenius to $ENVIRONMENT using $DEPLOY_TARGET...${NC}"

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

# Deploy based on target
case $DEPLOY_TARGET in
  docker)
    echo -e "${GREEN}Deploying with Docker Compose...${NC}"
    docker-compose -f docker-compose.yml build
    docker-compose -f docker-compose.yml up -d
    ;;

  aws)
    echo -e "${GREEN}Deploying to AWS...${NC}"
    cd deployment/terraform/aws
    terraform init
    terraform workspace select $ENVIRONMENT || terraform workspace new $ENVIRONMENT
    terraform plan -var-file="$ENVIRONMENT.tfvars" -out=terraform.plan
    terraform apply terraform.plan
    cd ../../..
    ;;

  gcp)
    echo -e "${GREEN}Deploying to Google Cloud Platform...${NC}"
    # TODO: Add GCP deployment steps
    echo -e "${YELLOW}GCP deployment not implemented yet${NC}"
    ;;

  azure)
    echo -e "${GREEN}Deploying to Azure...${NC}"
    # TODO: Add Azure deployment steps
    echo -e "${YELLOW}Azure deployment not implemented yet${NC}"
    ;;

  k8s)
    echo -e "${GREEN}Deploying to Kubernetes...${NC}"
    # Apply Kubernetes manifests in order
    kubectl apply -f deployment/kubernetes/00-namespace.yaml
    kubectl apply -f deployment/kubernetes/01-secrets.yaml
    kubectl apply -f deployment/kubernetes/02-postgres.yaml
    kubectl apply -f deployment/kubernetes/03-redis.yaml
    kubectl apply -f deployment/kubernetes/04-backend.yaml
    kubectl apply -f deployment/kubernetes/05-frontend.yaml
    ;;
esac

echo -e "${GREEN}Deployment complete!${NC}"
exit 0 