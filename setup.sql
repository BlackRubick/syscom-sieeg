-- Ejecuta este script en phpMyAdmin o MySQL CLI antes de iniciar la app
CREATE DATABASE IF NOT EXISTS sieeg_syscom
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sieeg_syscom;

CREATE TABLE IF NOT EXISTS users (
  id          VARCHAR(36)   NOT NULL,
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  password    VARCHAR(255)  NOT NULL,
  role        ENUM('admin','buyer','approver','viewer') NOT NULL DEFAULT 'buyer',
  department  VARCHAR(255)  NOT NULL,
  status      ENUM('active','inactive','pending')       NOT NULL DEFAULT 'active',
  created_at  DATE          NOT NULL,
  last_login  DATE          DEFAULT NULL,
  purchase_limit DECIMAL(12,2) DEFAULT NULL,
  avatar      VARCHAR(10)   DEFAULT NULL,
  -- Datos fiscales
  fiscal_completed    TINYINT(1)    NOT NULL DEFAULT 0,
  fiscal_rfc          VARCHAR(13)   DEFAULT NULL,
  fiscal_razon_social VARCHAR(255)  DEFAULT NULL,
  fiscal_codpos       VARCHAR(5)    DEFAULT NULL,
  fiscal_email        VARCHAR(255)  DEFAULT NULL,
  fiscal_uso_cfdi     VARCHAR(4)    DEFAULT NULL,
  fiscal_regimen      VARCHAR(3)    DEFAULT NULL,
  fiscal_pais         VARCHAR(3)    DEFAULT NULL,
  fiscal_calle        VARCHAR(255)  DEFAULT NULL,
  fiscal_num_exterior VARCHAR(50)   DEFAULT NULL,
  fiscal_num_interior VARCHAR(50)   DEFAULT NULL,
  fiscal_colonia      VARCHAR(255)  DEFAULT NULL,
  fiscal_ciudad       VARCHAR(255)  DEFAULT NULL,
  fiscal_delegacion   VARCHAR(255)  DEFAULT NULL,
  fiscal_localidad    VARCHAR(255)  DEFAULT NULL,
  fiscal_estado       VARCHAR(255)  DEFAULT NULL,
  fiscal_num_reg_id_trib VARCHAR(40) DEFAULT NULL,
  fiscal_nombre       VARCHAR(255)  DEFAULT NULL,
  fiscal_apellidos    VARCHAR(255)  DEFAULT NULL,
  fiscal_telefono     VARCHAR(20)   DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Si la tabla ya existe, agrega las columnas fiscales (migración)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS fiscal_completed    TINYINT(1)    NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fiscal_rfc          VARCHAR(13)   DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_razon_social VARCHAR(255)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_codpos       VARCHAR(5)    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_email        VARCHAR(255)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_uso_cfdi     VARCHAR(4)    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_regimen      VARCHAR(3)    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_pais         VARCHAR(3)    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_calle        VARCHAR(255)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_num_exterior VARCHAR(50)   DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_num_interior VARCHAR(50)   DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_colonia      VARCHAR(255)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_ciudad       VARCHAR(255)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_delegacion   VARCHAR(255)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_localidad    VARCHAR(255)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_estado       VARCHAR(255)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_num_reg_id_trib VARCHAR(40) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_nombre       VARCHAR(255)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_apellidos    VARCHAR(255)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fiscal_telefono     VARCHAR(20)   DEFAULT NULL;

-- Datos iniciales (contraseñas en SHA-256)
INSERT IGNORE INTO users VALUES
('u1','Ana García López',   'ana.garcia@empresa.com',     SHA2('Admin2026!',256),    'admin',    'Tecnología',  'active',   '2024-01-15','2026-06-03',500000.00,'AG'),
('u2','Carlos Mendoza',     'carlos.mendoza@empresa.com', SHA2('Compras2026!',256),  'buyer',    'Compras',     'active',   '2024-03-20','2026-06-02',150000.00,'CM'),
('u3','Sofía Ramírez',      'sofia.ramirez@empresa.com',  SHA2('Finanzas2026!',256), 'approver', 'Finanzas',    'active',   '2024-02-10','2026-06-03',300000.00,'SR'),
('u4','Luis Torres',        'luis.torres@empresa.com',    SHA2('Torres2026!',256),   'buyer',    'Operaciones', 'inactive', '2024-05-01','2026-05-28',100000.00,'LT'),
('u5','María Flores',       'maria.flores@empresa.com',   SHA2('RRHH2026!',256),     'viewer',   'RRHH',        'active',   '2025-01-10','2026-06-01',NULL,     'MF'),
('u6','Roberto Vega',       'roberto.vega@empresa.com',   SHA2('Vega2026!',256),     'buyer',    'Manufactura', 'pending',  '2026-05-30',NULL,        200000.00,'RV');
