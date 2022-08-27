import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const typeOrmConfig = new DataSource({
  type: process.env.CONNECTION_TYPE,
  url: process.env.CONNECTION_STRING,
  entities: [`${__dirname}/../../../**/*.entity{.js,.ts}`],
  synchronize: false,
  logging: true,
  migrations: [`${__dirname}/../../../../migrations/**/*{.ts,.js}`],
} as DataSourceOptions);

export default typeOrmConfig;
