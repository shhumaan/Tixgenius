-- PostgreSQL initialization script for TixGenius
-- This script creates the database schema and initial objects

-- Create the database if it doesn't exist (usually handled by Docker/Kubernetes)
-- CREATE DATABASE tixgenius;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a function for generating audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSONB;
    new_data JSONB;
    user_id UUID;
BEGIN
    -- Get current user ID from application_name (can be set by backend)
    BEGIN
        user_id := current_setting('app.current_user_id')::UUID;
    EXCEPTION WHEN OTHERS THEN
        user_id := NULL;
    END;

    -- Create audit log entry
    IF TG_OP = 'INSERT' THEN
        new_data := to_jsonb(NEW);
        INSERT INTO audit_logs (
            action,
            entity_type,
            entity_id,
            created_by_id,
            new_values
        ) VALUES (
            'CREATE',
            TG_TABLE_NAME,
            NEW.id,
            user_id,
            new_data
        );

    ELSIF TG_OP = 'UPDATE' THEN
        old_data := to_jsonb(OLD);
        new_data := to_jsonb(NEW);
        
        -- Only create audit log if there are changes
        IF old_data <> new_data THEN
            INSERT INTO audit_logs (
                action,
                entity_type,
                entity_id,
                created_by_id,
                old_values,
                new_values
            ) VALUES (
                'UPDATE',
                TG_TABLE_NAME,
                NEW.id,
                user_id,
                old_data,
                new_data
            );
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        old_data := to_jsonb(OLD);
        INSERT INTO audit_logs (
            action,
            entity_type,
            entity_id,
            created_by_id,
            old_values
        ) VALUES (
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            user_id,
            old_data
        );
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Added create_timestamp function for models
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql; 