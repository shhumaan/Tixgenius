-- Create triggers for audit logging on all relevant tables

-- Users table
CREATE TRIGGER users_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Teams table
CREATE TRIGGER teams_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON teams
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER teams_updated_at_trigger
BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Developers table
CREATE TRIGGER developers_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON developers
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER developers_updated_at_trigger
BEFORE UPDATE ON developers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Categories table
CREATE TRIGGER categories_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON categories
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER categories_updated_at_trigger
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Tickets table
CREATE TRIGGER tickets_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON tickets
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER tickets_updated_at_trigger
BEFORE UPDATE ON tickets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Assignments table
CREATE TRIGGER assignments_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON assignments
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER assignments_updated_at_trigger
BEFORE UPDATE ON assignments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Complaints table
CREATE TRIGGER complaints_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON complaints
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER complaints_updated_at_trigger
BEFORE UPDATE ON complaints
FOR EACH ROW EXECUTE FUNCTION set_updated_at(); 