terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.31.0"
    }
  }
  
  backend "s3" {
    bucket = "tixgenius-terraform-state"
    key    = "tixgenius/terraform.tfstate"
    region = "us-west-2"
    # Enable state locking with DynamoDB (uncomment after creating the table)
    # dynamodb_table = "tixgenius-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "TixGenius"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Create a VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"
  
  name = "tixgenius-${var.environment}-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  single_nat_gateway = var.environment != "production"
  
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Terraform   = "true"
    Environment = var.environment
  }
}

# Security groups
resource "aws_security_group" "alb" {
  name        = "tixgenius-${var.environment}-alb-sg"
  description = "ALB Security Group"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "backend" {
  name        = "tixgenius-${var.environment}-backend-sg"
  description = "Backend Security Group"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "frontend" {
  name        = "tixgenius-${var.environment}-frontend-sg"
  description = "Frontend Security Group"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "db" {
  name        = "tixgenius-${var.environment}-db-sg"
  description = "Database Security Group"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "redis" {
  name        = "tixgenius-${var.environment}-redis-sg"
  description = "Redis Security Group"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.backend.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# RDS PostgreSQL instance
resource "aws_db_subnet_group" "tixgenius" {
  name       = "tixgenius-${var.environment}-db-subnet"
  subnet_ids = module.vpc.private_subnets
  
  tags = {
    Name = "TixGenius DB subnet group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier             = "tixgenius-${var.environment}-db"
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = var.db_instance_class
  allocated_storage      = var.db_allocated_storage
  max_allocated_storage  = var.db_max_allocated_storage
  
  db_name                = "tixgenius"
  username               = "tixgenius"
  password               = var.db_password
  
  db_subnet_group_name   = aws_db_subnet_group.tixgenius.name
  vpc_security_group_ids = [aws_security_group.db.id]
  
  backup_retention_period = var.environment == "production" ? 7 : 1
  skip_final_snapshot     = var.environment != "production"
  
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  
  tags = {
    Name = "TixGenius ${var.environment} PostgreSQL"
  }
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "tixgenius" {
  name       = "tixgenius-${var.environment}-redis-subnet"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "tixgenius-${var.environment}-redis"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = var.redis_node_type
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  
  subnet_group_name    = aws_elasticache_subnet_group.tixgenius.name
  security_group_ids   = [aws_security_group.redis.id]
  
  tags = {
    Name = "TixGenius ${var.environment} Redis"
  }
} 