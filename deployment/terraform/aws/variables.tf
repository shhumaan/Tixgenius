variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name (development, staging, production)"
  type        = string
  default     = "development"
  
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production."
  }
}

# Database
variable "db_password" {
  description = "PostgreSQL database password"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.small"
}

variable "db_allocated_storage" {
  description = "Allocated storage for the database (GB)"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for the database (GB)"
  type        = number
  default     = 100
}

# Redis
variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t3.small"
}

# ECS
variable "backend_container_cpu" {
  description = "Backend container CPU units"
  type        = number
  default     = 256
}

variable "backend_container_memory" {
  description = "Backend container memory (MB)"
  type        = number
  default     = 512
}

variable "frontend_container_cpu" {
  description = "Frontend container CPU units"
  type        = number
  default     = 256
}

variable "frontend_container_memory" {
  description = "Frontend container memory (MB)"
  type        = number
  default     = 512
}

# Domain
variable "domain_name" {
  description = "Base domain name for the application"
  type        = string
  default     = "example.com"
}

variable "backend_subdomain" {
  description = "Subdomain for the backend API"
  type        = string
  default     = "api"
}

# Docker Images
variable "backend_image" {
  description = "Docker image for the backend"
  type        = string
  default     = "ghcr.io/yourusername/tixgenius/backend:latest"
}

variable "frontend_image" {
  description = "Docker image for the frontend"
  type        = string
  default     = "ghcr.io/yourusername/tixgenius/frontend:latest"
}

# Application settings
variable "jwt_secret" {
  description = "Secret key for JWT tokens"
  type        = string
  sensitive   = true
}

variable "session_secret" {
  description = "Secret key for sessions"
  type        = string
  sensitive   = true
} 