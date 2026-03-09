import 'dotenv/config'

const env = {
  port: process.env.PORT || '3000',
  db_host: process.env.DB_HOST || 'localhost',
  db_user: process.env.DB_USER || 'root',
  db_password: process.env.DB_PASSWORD || '',
  db_database: process.env.DB_DATABASE || 'diplomado_db',
  db_dialect: process.env.DB_DIALECT || 'mysql',
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  jwt_secret: process.env.JWT_SECRET || 'secreto',
  jwt_expires_in: process.env.JWT_EXPIRES_IN || '10m',
}

export default env