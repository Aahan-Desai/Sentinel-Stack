import mongoose from 'mongoose';
import { Tenant } from '../modules/tenants/tenant.model.js';

const run = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/sentinelstack');

    const tenants = await Tenant.find({});
    console.log('Tenants in DB:', tenants);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
