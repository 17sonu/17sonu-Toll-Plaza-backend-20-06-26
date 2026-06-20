require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const TollPlaza = require('./models/TollPlaza');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existingAdmin = await Admin.findOne({ username: 'admin' });
  if (!existingAdmin) {
    await Admin.create({ username: 'admin', password: 'admin123' });
    console.log('Default admin created -> username: admin / password: admin123');
  } else {
    console.log('Admin already exists, skipping');
  }

  const plazaCount = await TollPlaza.countDocuments();
  if (plazaCount === 0) {
    await TollPlaza.insertMany([
      {
        name: 'NH-2 Durgapur Toll Plaza',
        location: 'Durgapur, West Bengal',
        rates: [
          { vehicleType: 'Two-Wheeler', rate: 20 },
          { vehicleType: 'Car', rate: 65 },
          { vehicleType: 'Bus', rate: 130 },
          { vehicleType: 'Truck', rate: 210 },
        ],
      },
      {
        name: 'NH-19 Panagarh Toll Plaza',
        location: 'Panagarh, West Bengal',
        rates: [
          { vehicleType: 'Two-Wheeler', rate: 15 },
          { vehicleType: 'Car', rate: 55 },
          { vehicleType: 'Bus', rate: 110 },
          { vehicleType: 'Truck', rate: 190 },
        ],
      },
    ]);
    console.log('Sample toll plazas created');
  } else {
    console.log('Toll plazas already exist, skipping');
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
