import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SERVICE_CATEGORIES = [
  { name: 'Engine Diagnostic & Scan', description: 'Complete computer diagnostic check and OBD-II scanner reading', basePrice: 1499, iconName: 'Activity' },
  { name: 'Full Brake Replacement', description: 'Front & rear ceramic brake pads and rotor resurfacing', basePrice: 3499, iconName: 'ShieldAlert' },
  { name: 'Synthetic Oil & Filter Change', description: 'Premium 5W-30 synthetic oil change with OEM filter', basePrice: 1899, iconName: 'Droplet' },
  { name: 'Battery Diagnostic & Swap', description: '12V heavy-duty battery testing and instant replacement', basePrice: 4299, iconName: 'Zap' },
  { name: 'Tire Rotation & Alignment', description: '4-wheel computerized alignment and high-speed balancing', basePrice: 1199, iconName: 'Disc' },
  { name: 'AC Service & Gas Recharge', description: 'Compressor check, cabin air filter replacement, R134a refrigerant', basePrice: 2299, iconName: 'Wind' },
  { name: 'Transmission Flush & Fluid', description: 'Automatic transmission fluid drain, flush, and filter replacement', basePrice: 4999, iconName: 'Settings' },
  { name: 'Emergency Roadside Towing', description: '24/7 flatbed vehicle recovery and roadside assistance', basePrice: 2999, iconName: 'Truck' },
];

const MECHANIC_NAMES = [
  { name: 'Rajesh Kumar', spec: 'Engine & Diagnostics', lat: 28.6139, lng: 77.2090 },
  { name: 'Amit Sharma', spec: 'Brake Specialist', lat: 28.6280, lng: 77.2189 },
  { name: 'Vikram Singh', spec: 'Transmission Expert', lat: 28.5355, lng: 77.3910 },
  { name: 'Suresh Patel', spec: 'Electrical & Batteries', lat: 28.7041, lng: 77.1025 },
  { name: 'Deepak Verma', spec: 'Tires & Suspension', lat: 28.4595, lng: 77.0266 },
  { name: 'Manoj Joshi', spec: 'AC & Climate Control', lat: 28.5244, lng: 77.1855 },
  { name: 'Rohan Gupta', spec: 'Roadside Recovery', lat: 28.6304, lng: 77.2177 },
  { name: 'Pankaj Yadav', spec: 'Engine & Diagnostics', lat: 28.5494, lng: 77.2501 },
  { name: 'Anil Choudhary', spec: 'General Mechanic', lat: 28.5672, lng: 77.3211 },
  { name: 'Sanjay Mishra', spec: 'Brake & Hydraulics', lat: 28.6500, lng: 77.2300 },
  { name: 'Rahul Nair', spec: 'Hybrid & EV Tech', lat: 28.4089, lng: 77.3178 },
  { name: 'Arjun Mehta', spec: 'Performance Tuning', lat: 28.6100, lng: 77.2200 },
  { name: 'Karan Malhotra', spec: 'Oil & Lube Specialist', lat: 28.5800, lng: 77.2100 },
  { name: 'Devendra Rao', spec: 'Transmission Expert', lat: 28.6700, lng: 77.1500 },
  { name: 'Praveen Reddy', spec: 'AC Specialist', lat: 28.5000, lng: 77.0800 },
  { name: 'Alok Pandey', spec: 'Roadside Towing', lat: 28.6400, lng: 77.1100 },
  { name: 'Gaurav Saxena', spec: 'Brake Specialist', lat: 28.5900, lng: 77.3000 },
  { name: 'Nilesh Kulkarni', spec: 'General Repair', lat: 28.4800, lng: 77.0500 },
  { name: 'Harish Bishnoi', spec: 'Electrical Master', lat: 28.6600, lng: 77.2800 },
  { name: 'Sunil Tiwari', spec: 'Suspension Master', lat: 28.5100, lng: 77.2400 },
  { name: 'Aakash Bansal', spec: 'Engine Specialist', lat: 28.6200, lng: 77.1800 },
  { name: 'Tarun Sethi', spec: 'EV Systems', lat: 28.5500, lng: 77.1600 },
  { name: 'Vivek Kapoor', spec: 'Quick Lube Tech', lat: 28.6800, lng: 77.2200 },
  { name: 'Jitendra Saini', spec: 'Recovery Specialist', lat: 28.4600, lng: 77.1200 },
];

const CUSTOMER_NAMES = [
  'Aarav Sharma', 'Vivaan Patel', 'Aditya Verma', 'Vihaan Gupta', 'Arjun Kumar',
  'Sai Krishna', 'Reyansh Singh', 'Ayaan Joshi', 'Ishaan Mehta', 'Krishna Rao',
  'Ananya Roy', 'Diya Sen', 'Aditi Nair', 'Sanya Malhotra', 'Kavya Kapoor',
  'Priya Sethi', 'Riya Bansal', 'Neha Saxena', 'Pooja Reddy', 'Sneha Deshmukh',
  'Rohan Chawla', 'Varun Bhatia', 'Siddharth Pillai', 'Karan Ahuja', 'Kabir Hegde',
  'Tara Menon', 'Meera Trivedi', 'Shreya Aggarwal', 'Divya Kaushik', 'Shruti Rastogi',
  'Manish Dube', 'Nikhil Bajaj', 'Abhishek Gill', 'Pranav Kulkarni', 'Gautam Nambiar',
  'Tanya Merchant', 'Simran Khurana', 'Sonam Grover', 'Payal Mahajan', 'Kirti Vohra',
  'Kunal Goel', 'Ashish Tandon', 'Rishi Oberoi', 'Chirag Parekh', 'Samarth Jain',
  'Richa Thapar', 'Barkha Shrivastava', 'Nidhi Dewangan', 'Swati Pathak', 'Ekta Singhal',
  'Bhavesh Somani', 'Dharmesh Merchant', 'Farhan Qureshi', 'Harshil Shah', 'Imran Khan',
  'Jaideep Ahluwalia', 'Lokesh Suri', 'Mayank Wadhwa', 'Naveen Mathur', 'Omkar Bhosale'
];

const VEHICLE_MAKES_MODELS = [
  { make: 'Maruti Suzuki', models: ['Swift', 'Baleno', 'Brezza', 'Dzire', 'Ertiga'] },
  { make: 'Hyundai', models: ['Creta', 'i20', 'Verna', 'Venue', 'Alcazar'] },
  { make: 'Tata', models: ['Nexon', 'Harrier', 'Safari', 'Punch', 'Altroz'] },
  { make: 'Mahindra', models: ['Thar', 'XUV700', 'Scorpio-N', 'Bolero', 'XUV300'] },
  { make: 'Honda', models: ['City', 'Amaze', 'Elevate', 'Civic'] },
  { make: 'Toyota', models: ['Fortuner', 'Innova Crysta', 'Glanza', 'Urban Cruiser'] },
  { make: 'Volkswagen', models: ['Virtus', 'Taigun', 'Polo'] },
  { make: 'BMW', models: ['3 Series', '5 Series', 'X3', 'X5'] },
];

const CITIES = ['New Delhi', 'Gurugram', 'Noida', 'Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai'];

const STATUSES = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'IN_PROGRESS', 'IN_TRANSIT', 'ASSIGNED', 'PENDING', 'CANCELLED'];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Starting seed process...');

  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.mechanic.deleteMany();
  await prisma.serviceCategory.deleteMany();

  console.log('Cleaned database tables.');

  // 1. Seed Service Categories
  const createdCategories = [];
  for (const cat of SERVICE_CATEGORIES) {
    const created = await prisma.serviceCategory.create({ data: cat });
    createdCategories.push(created);
  }
  console.log(`Seeded ${createdCategories.length} service categories.`);

  // 2. Seed Mechanics
  const createdMechanics = [];
  const statusPool = ['AVAILABLE', 'AVAILABLE', 'ON_DUTY', 'IN_TRANSIT', 'BUSY', 'OFFLINE'];
  for (let i = 0; i < MECHANIC_NAMES.length; i++) {
    const m = MECHANIC_NAMES[i];
    const created = await prisma.mechanic.create({
      data: {
        name: m.name,
        email: `mechanic.${i + 1}@instantmechanic.com`,
        phone: `+91 ${getRandomInt(98000, 99999)} ${getRandomInt(10000, 99999)}`,
        specialization: m.spec,
        status: statusPool[i % statusPool.length],
        rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
        jobsCompleted: getRandomInt(25, 340),
        currentLat: m.lat + (Math.random() - 0.5) * 0.05,
        currentLng: m.lng + (Math.random() - 0.5) * 0.05,
        avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + i * 100}?w=150&auto=format&fit=crop&q=80`
      }
    });
    createdMechanics.push(created);
  }
  console.log(`Seeded ${createdMechanics.length} mechanics.`);

  // 3. Seed Customers
  const createdCustomers = [];
  for (let i = 0; i < CUSTOMER_NAMES.length; i++) {
    const name = CUSTOMER_NAMES[i];
    const created = await prisma.customer.create({
      data: {
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        phone: `+91 ${getRandomInt(91000, 97999)} ${getRandomInt(10000, 99999)}`,
        city: getRandomItem(CITIES),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      }
    });
    createdCustomers.push(created);
  }
  console.log(`Seeded ${createdCustomers.length} customers.`);

  // 4. Seed 550+ Bookings
  console.log('Seeding 550+ bookings across past 12 months...');
  const now = new Date();
  const customerSpentMap: Record<string, number> = {};

  for (let i = 1; i <= 560; i++) {
    const customer = getRandomItem(createdCustomers);
    const category = getRandomItem(createdCategories);
    const vehicleObj = getRandomItem(VEHICLE_MAKES_MODELS);
    const model = getRandomItem(vehicleObj.models);
    const status = getRandomItem(STATUSES);
    
    // Assign mechanic for non-pending bookings
    const mechanic = status !== 'PENDING' ? getRandomItem(createdMechanics) : null;
    
    // Generate dates: past 365 days, skewed towards recent days
    const daysAgo = Math.floor(Math.pow(Math.random(), 2) * 365);
    const bookingDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - getRandomInt(0, 86400) * 1000);
    
    const amount = category.basePrice + getRandomInt(-200, 800);
    const bookingNumber = `IM-2025-${String(i).padStart(5, '0')}`;
    
    const stateCodes = ['DL', 'HR', 'UP', 'KA', 'MH', 'TS'];
    const licensePlate = `${getRandomItem(stateCodes)} ${getRandomInt(1, 99).toString().padStart(2, '0')} ${String.fromCharCode(65 + getRandomInt(0, 25))}${String.fromCharCode(65 + getRandomInt(0, 25))} ${getRandomInt(1000, 9999)}`;

    await prisma.booking.create({
      data: {
        bookingNumber,
        customerId: customer.id,
        mechanicId: mechanic ? mechanic.id : null,
        serviceCategoryId: category.id,
        vehicleMake: vehicleObj.make,
        vehicleModel: model,
        vehicleYear: getRandomInt(2017, 2024),
        licensePlate,
        status,
        amount,
        paymentStatus: status === 'CANCELLED' ? 'REFUNDED' : status === 'PENDING' ? 'PENDING' : 'PAID',
        paymentMethod: getRandomItem(['UPI', 'CARD', 'CASH', 'NET_BANKING']),
        address: `${getRandomInt(12, 450)}, Sector ${getRandomInt(1, 120)}, ${customer.city}`,
        notes: Math.random() > 0.6 ? 'Customer requested urgent diagnostic before long highway drive.' : null,
        rating: status === 'COMPLETED' ? getRandomInt(4, 5) : null,
        feedback: status === 'COMPLETED' && Math.random() > 0.5 ? 'Excellent service! Mechanic arrived on time.' : null,
        createdAt: bookingDate,
        updatedAt: bookingDate,
        completedAt: status === 'COMPLETED' ? new Date(bookingDate.getTime() + 7200000) : null
      }
    });

    if (status === 'COMPLETED') {
      customerSpentMap[customer.id] = (customerSpentMap[customer.id] || 0) + amount;
    }
  }

  // Update totalSpent on customers
  for (const [customerId, spent] of Object.entries(customerSpentMap)) {
    await prisma.customer.update({
      where: { id: customerId },
      data: { totalSpent: spent }
    });
  }

  console.log('Seeding finished successfully! Database is ready.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
