import { Sequelize } from 'sequelize';
import pg from 'pg';

pg.types.setTypeParser(1114, (stringValue) => {
  return new Date(stringValue + 'Z'); // Ajoute le fuseau horaire UTC
});

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string, 
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10), 
    dialect: "postgres", 
    logging: false, 
  }
);

export default sequelize;
