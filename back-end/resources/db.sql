CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  coordenada_x FLOAT,
  coordenada_y FLOAT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  excluido_em TIMESTAMP
);
