import { connect } from 'mongoose';
import { MONGO_URL, DEV_MONGO_URL } from '@data/constants';

export default async function MongoConnect(dev: boolean){
  await connect(dev ? DEV_MONGO_URL : MONGO_URL).then(() => console.log(`Connected to MongoDB in ${dev ? 'development' : 'production'} mode`)).catch((err: Error) => console.error(err.message, err));

}