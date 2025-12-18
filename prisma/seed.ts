import { PrismaClient, Role, UserStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data (optional - comment out in production)
  console.log('🧹 Cleaning existing data...')
  await prisma.message.deleteMany()
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.photo.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.city.deleteMany()

  // Create Cities
  console.log('🏙️ Creating cities...')
  const cities = [
    { name: 'Mumbai', slug: 'mumbai', heroImg: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200&h=600&fit=crop' },
    { name: 'Delhi', slug: 'delhi', heroImg: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60b?w=1200&h=600&fit=crop' },
    { name: 'Bangalore', slug: 'bangalore', heroImg: 'https://images.unsplash.com/photo-1560930950-077f54d5c4c5?w=1200&h=600&fit=crop' },
    { name: 'Hyderabad', slug: 'hyderabad', heroImg: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&h=600&fit=crop' },
    { name: 'Chennai', slug: 'chennai', heroImg: 'https://images.unsplash.com/photo-1582719471384-894f5f4f4487?w=1200&h=600&fit=crop' },
    { name: 'Kolkata', slug: 'kolkata', heroImg: 'https://images.unsplash.com/photo-1582719478145-9f72ee5f0f1b?w=1200&h=600&fit=crop' },
    { name: 'Pune', slug: 'pune', heroImg: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200&h=600&fit=crop' },
    { name: 'Ahmedabad', slug: 'ahmedabad', heroImg: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200&h=600&fit=crop' },
    { name: 'Jaipur', slug: 'jaipur', heroImg: 'https://images.unsplash.com/photo-1556702571-c19fefa1c72e?w=1200&h=600&fit=crop' },
    { name: 'Goa', slug: 'goa', heroImg: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200&h=600&fit=crop' },
  ]

  const createdCities = await Promise.all(
    cities.map(city => prisma.city.create({ data: city }))
  )

  console.log(`✅ Created ${createdCities.length} cities`)

  // Create Admin User
  console.log('👤 Creating admin user...')
  const adminPassword = await bcrypt.hash('admin123', 10)
  const _admin = await prisma.user.create({
    data: {
      email: 'admin@elite.com',
      password: adminPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  })
  console.log('✅ Admin user created')

  // Create Sample Escorts
  console.log('💃 Creating escorts...')
  const escorts = [
    {
      email: 'isabella@elite.com',
      password: 'escort123',
      displayName: 'Isabella Rose',
      age: 24,
      citySlug: 'mumbai',
      bio: 'Sophisticated and elegant companion available for dinner dates, social events, and private encounters. Fluent in English and French, enjoys fine dining and intellectual conversations.',
      rateHourly: 500,
      services: ['Dinner Dates', 'Events', 'Travel', 'Massage'],
      isVerified: true,
      isVip: true,
      whatsappNumber: '+919876543210',
      phoneNumber: '+919876543210',
      mainPhotoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop',
      ],
    },
    {
      email: 'sophia@elite.com',
      password: 'escort123',
      displayName: 'Sophia Laurent',
      age: 26,
      citySlug: 'delhi',
      bio: 'Professional and discreet companion specializing in VIP experiences and luxury travel. Available for high-profile events and exclusive gatherings.',
      rateHourly: 600,
      services: ['VIP Experience', 'Travel', 'Events', 'Business'],
      isVerified: true,
      isVip: true,
      whatsappNumber: '+919876543211',
      phoneNumber: null,
      mainPhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop',
      ],
    },
    {
      email: 'victoria@elite.com',
      password: 'escort123',
      displayName: 'Victoria Chen',
      age: 23,
      citySlug: 'bangalore',
      bio: 'Energetic and fun-loving companion perfect for beach outings, nightlife, and social events. Bilingual in English and Mandarin.',
      rateHourly: 450,
      services: ['Events', 'Beach', 'Nightlife', 'Photoshoots'],
      isVerified: true,
      isVip: false,
      whatsappNumber: null,
      phoneNumber: '+919876543212',
      mainPhotoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop',
      ],
    },
    {
      email: 'natasha@elite.com',
      password: 'escort123',
      displayName: 'Natasha Volkov',
      age: 27,
      citySlug: 'hyderabad',
      bio: 'Exotic and mysterious companion with European elegance. Perfect for casino nights, shows, and exclusive VIP experiences.',
      rateHourly: 550,
      services: ['VIP Experience', 'Events', 'Casino', 'Travel'],
      isVerified: true,
      isVip: true,
      whatsappNumber: '+919876543213',
      phoneNumber: '+919876543213',
      mainPhotoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop',
      ],
    },
    {
      email: 'emma@elite.com',
      password: 'escort123',
      displayName: 'Emma Williams',
      age: 25,
      citySlug: 'chennai',
      bio: 'Classic beauty with a warm personality. Ideal for dinner dates, cultural events, and meaningful conversations.',
      rateHourly: 400,
      services: ['Dinner Dates', 'Events', 'Massage', 'Girlfriend Exp'],
      isVerified: true,
      isVip: false,
      whatsappNumber: '+919876543214',
      phoneNumber: null,
      mainPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop',
      ],
    },
    {
      email: 'olivia@elite.com',
      password: 'escort123',
      displayName: 'Olivia Martinez',
      age: 28,
      citySlug: 'pune',
      bio: 'Mature and sophisticated companion with business acumen. Perfect for corporate events and professional gatherings.',
      rateHourly: 520,
      services: ['Business Events', 'VIP Experience', 'Travel', 'Dinner Dates'],
      isVerified: true,
      isVip: true,
      whatsappNumber: '+919876543215',
      phoneNumber: '+919876543215',
      mainPhotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&h=1000&fit=crop',
      ],
    },
    {
      email: 'aisha@elite.com',
      password: 'escort123',
      displayName: 'Aisha Khan',
      age: 26,
      citySlug: 'ahmedabad',
      bio: 'Charming and cultured companion with a passion for art and cuisine.',
      rateHourly: 480,
      services: ['Dinner Dates', 'Events', 'Travel'],
      isVerified: true,
      isVip: false,
      whatsappNumber: null,
      phoneNumber: '+919876543216',
      mainPhotoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop',
      ],
    },
    {
      email: 'rhea@elite.com',
      password: 'escort123',
      displayName: 'Rhea Kapoor',
      age: 24,
      citySlug: 'jaipur',
      bio: 'Elegant and well-traveled companion, fluent in French and English.',
      rateHourly: 510,
      services: ['VIP Experience', 'Events', 'Travel'],
      isVerified: true,
      isVip: true,
      whatsappNumber: '+919876543217',
      phoneNumber: '+919876543217',
      mainPhotoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop',
      ],
    },
    {
      email: 'sanaya@elite.com',
      password: 'escort123',
      displayName: 'Sanaya Mehta',
      age: 25,
      citySlug: 'goa',
      bio: 'Beach-loving, adventurous companion for getaways and events.',
      rateHourly: 430,
      services: ['Travel', 'Events', 'Photoshoots'],
      isVerified: true,
      isVip: false,
      whatsappNumber: '+919876543218',
      phoneNumber: null,
      mainPhotoUrl: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=1000&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop',
      ],
    },
    {
      email: 'tara@elite.com',
      password: 'escort123',
      displayName: 'Tara Sen',
      age: 27,
      citySlug: 'kolkata',
      bio: 'Sophisticated companion with love for literature and theater.',
      whatsappNumber: '+919876543219',
      phoneNumber: '+919876543219',
      rateHourly: 490,
      services: ['Dinner Dates', 'Events', 'Cultural'],
      isVerified: true,
      isVip: false,
      mainPhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop',
      ],
    },
  ]

  for (const escortData of escorts) {
    const city = createdCities.find(c => c.slug === escortData.citySlug)
    if (!city) continue

    const hashedPassword = await bcrypt.hash(escortData.password, 10)
    const { photos, citySlug: _citySlug, email: _email, password: _password, ...escortProfileData } = escortData

    const _user = await prisma.user.create({
      data: {
        email: escortData.email,
        password: hashedPassword,
        role: Role.ESCORT,
        status: UserStatus.ACTIVE,
        profile: {
          create: {
            ...escortProfileData,
            cityId: city.id,
            photos: {
              create: photos.map(url => ({ url, alt: escortData.displayName })),
            },
            listing: {
              create: {
                title: `${escortData.displayName} - Premium Companion`,
                about: escortData.bio,
                cityId: city.id,
                isVisible: true,
              },
            },
          },
        },
      },
    })

    console.log(`✅ Created escort: ${escortData.displayName}`)
  }

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

