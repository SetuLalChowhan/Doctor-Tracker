import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { hashPassword } from "../utils/auth.util.js";

/**
 * Comprehensive Seed for Doctor Tracker Demo (Phase 17)
 */
export async function runSeeds(forceReset = false): Promise<void> {
  try {
    // 1. Seed Admin User
    const adminEmail = "admin@doctortracker.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await hashPassword("Admin123!");
      await User.create({
        name: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("🌱 Admin user seeded successfully! (admin@doctortracker.com / Admin123!)");
    }

    // 2. Seed Doctors and Patients if missing or forceReset
    const doctorCount = await Doctor.countDocuments();
    const patientCount = await Patient.countDocuments();

    if (doctorCount === 0 || patientCount === 0 || forceReset) {
      if (forceReset) {
        await Patient.deleteMany({});
        await Doctor.deleteMany({});
        console.log("🧹 Reset old doctor and patient records.");
      }

      console.log("🌱 Seeding realistic doctor & patient demo dataset...");

      const sampleDoctors = await Doctor.insertMany([
        {
          name: "Dr. Sarah Jenkins",
          specialization: "Cardiology",
          hospital: "Metro Health Hospital",
          phone: "+1-555-0101",
          email: "sarah.jenkins@metrohealth.org",
        },
        {
          name: "Dr. Michael Chang",
          specialization: "Neurology",
          hospital: "St. Jude Medical Center",
          phone: "+1-555-0102",
          email: "m.chang@stjude.org",
        },
        {
          name: "Dr. Elena Rostova",
          specialization: "Pediatrics",
          hospital: "City Children's Hospital",
          phone: "+1-555-0103",
          email: "elena.r@citychildrens.org",
        },
        {
          name: "Dr. James Wilson",
          specialization: "Orthopedics",
          hospital: "General Memorial Hospital",
          phone: "+1-555-0104",
          email: "jwilson@generalmemorial.org",
        },
        {
          name: "Dr. Marcus Vance",
          specialization: "General Medicine",
          hospital: "St. Jude Medical Center",
          phone: "+1-555-0105",
          email: "marcus.vance@stjude.org",
        },
        {
          name: "Dr. Amanda Hayes",
          specialization: "Dermatology",
          hospital: "Metro Health Hospital",
          phone: "+1-555-0106",
          email: "a.hayes@metrohealth.org",
        },
        {
          name: "Dr. Robert Sterling",
          specialization: "Oncology",
          hospital: "General Memorial Hospital",
          phone: "+1-555-0107",
          email: "r.sterling@generalmemorial.org",
        },
        {
          name: "Dr. Priya Patel",
          specialization: "Psychiatry",
          hospital: "City Children's Hospital",
          phone: "+1-555-0108",
          email: "ppatel@citychildrens.org",
        },
        {
          name: "Dr. David Kim",
          specialization: "Cardiology",
          hospital: "St. Jude Medical Center",
          phone: "+1-555-0109",
          email: "dkim@stjude.org",
        },
        {
          name: "Dr. Laura Bennett",
          specialization: "Neurology",
          hospital: "Metro Health Hospital",
          phone: "+1-555-0110",
          email: "l.bennett@metrohealth.org",
        },
        {
          name: "Dr. Jonathan Ross",
          specialization: "Orthopedics",
          hospital: "City Children's Hospital",
          phone: "+1-555-0111",
          email: "jross@citychildrens.org",
        },
        {
          name: "Dr. Sophia Reynolds",
          specialization: "General Medicine",
          hospital: "General Memorial Hospital",
          phone: "+1-555-0112",
          email: "sreynolds@generalmemorial.org",
        },
      ]);

      const now = new Date();
      const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      // Seed 25 realistic patients across doctors and registration dates
      await Patient.insertMany([
        {
          doctorId: sampleDoctors[0]._id,
          name: "John Doe",
          age: 45,
          gender: "Male",
          phone: "+1-555-0201",
          email: "john.doe@example.com",
          condition: "Hypertension",
          createdAt: daysAgo(28),
        },
        {
          doctorId: sampleDoctors[0]._id,
          name: "Alice Smith",
          age: 62,
          gender: "Female",
          phone: "+1-555-0202",
          email: "alice.smith@example.com",
          condition: "Coronary Artery Disease",
          createdAt: daysAgo(25),
        },
        {
          doctorId: sampleDoctors[0]._id,
          name: "Arthur Pendelton",
          age: 71,
          gender: "Male",
          phone: "+1-555-0203",
          email: "arthur.p@example.com",
          condition: "Hypertension",
          createdAt: daysAgo(20),
        },
        {
          doctorId: sampleDoctors[1]._id,
          name: "Robert Johnson",
          age: 38,
          gender: "Male",
          phone: "+1-555-0204",
          email: "robert.j@example.com",
          condition: "Migraine",
          createdAt: daysAgo(22),
        },
        {
          doctorId: sampleDoctors[1]._id,
          name: "Claire Vance",
          age: 29,
          gender: "Female",
          phone: "+1-555-0205",
          email: "claire.v@example.com",
          condition: "Migraine",
          createdAt: daysAgo(18),
        },
        {
          doctorId: sampleDoctors[2]._id,
          name: "Emily Davis",
          age: 8,
          gender: "Female",
          phone: "+1-555-0206",
          email: "parent.davis@example.com",
          condition: "Asthma",
          createdAt: daysAgo(26),
        },
        {
          doctorId: sampleDoctors[2]._id,
          name: "Lucas Miller",
          age: 12,
          gender: "Male",
          phone: "+1-555-0207",
          email: "parent.miller@example.com",
          condition: "Asthma",
          createdAt: daysAgo(15),
        },
        {
          doctorId: sampleDoctors[3]._id,
          name: "David Miller",
          age: 52,
          gender: "Male",
          phone: "+1-555-0208",
          email: "david.m@example.com",
          condition: "Osteoarthritis",
          createdAt: daysAgo(24),
        },
        {
          doctorId: sampleDoctors[3]._id,
          name: "Eleanor Wright",
          age: 65,
          gender: "Female",
          phone: "+1-555-0209",
          email: "eleanor.w@example.com",
          condition: "Osteoarthritis",
          createdAt: daysAgo(12),
        },
        {
          doctorId: sampleDoctors[4]._id,
          name: "Sophia Patel",
          age: 29,
          gender: "Female",
          phone: "+1-555-0210",
          email: "sophia.p@example.com",
          condition: "General Checkup",
          createdAt: daysAgo(21),
        },
        {
          doctorId: sampleDoctors[4]._id,
          name: "George Harris",
          age: 34,
          gender: "Male",
          phone: "+1-555-0211",
          email: "george.h@example.com",
          condition: "General Checkup",
          createdAt: daysAgo(14),
        },
        {
          doctorId: sampleDoctors[5]._id,
          name: "Hannah Abbott",
          age: 27,
          gender: "Female",
          phone: "+1-555-0212",
          email: "hannah.a@example.com",
          condition: "Eczema",
          createdAt: daysAgo(19),
        },
        {
          doctorId: sampleDoctors[5]._id,
          name: "Ian Gallagher",
          age: 31,
          gender: "Male",
          phone: "+1-555-0213",
          email: "ian.g@example.com",
          condition: "Eczema",
          createdAt: daysAgo(10),
        },
        {
          doctorId: sampleDoctors[6]._id,
          name: "Katherine Bell",
          age: 58,
          gender: "Female",
          phone: "+1-555-0214",
          email: "katherine.b@example.com",
          condition: "Coronary Artery Disease",
          createdAt: daysAgo(17),
        },
        {
          doctorId: sampleDoctors[7]._id,
          name: "Marcus Brody",
          age: 41,
          gender: "Male",
          phone: "+1-555-0215",
          email: "marcus.b@example.com",
          condition: "Depression",
          createdAt: daysAgo(16),
        },
        {
          doctorId: sampleDoctors[7]._id,
          name: "Nina Simone",
          age: 36,
          gender: "Female",
          phone: "+1-555-0216",
          email: "nina.s@example.com",
          condition: "Depression",
          createdAt: daysAgo(9),
        },
        {
          doctorId: sampleDoctors[8]._id,
          name: "Oliver Queen",
          age: 50,
          gender: "Male",
          phone: "+1-555-0217",
          email: "oliver.q@example.com",
          condition: "Hypertension",
          createdAt: daysAgo(13),
        },
        {
          doctorId: sampleDoctors[8]._id,
          name: "Penelope Cruz",
          age: 43,
          gender: "Female",
          phone: "+1-555-0218",
          email: "penelope.c@example.com",
          condition: "Hypertension",
          createdAt: daysAgo(7),
        },
        {
          doctorId: sampleDoctors[9]._id,
          name: "Quentin Tarantino",
          age: 55,
          gender: "Male",
          phone: "+1-555-0219",
          email: "quentin.t@example.com",
          condition: "Migraine",
          createdAt: daysAgo(11),
        },
        {
          doctorId: sampleDoctors[10]._id,
          name: "Rachel Green",
          age: 30,
          gender: "Female",
          phone: "+1-555-0220",
          email: "rachel.g@example.com",
          condition: "Osteoarthritis",
          createdAt: daysAgo(8),
        },
        {
          doctorId: sampleDoctors[10]._id,
          name: "Steven Hyde",
          age: 26,
          gender: "Male",
          phone: "+1-555-0221",
          email: "steven.h@example.com",
          condition: "Osteoarthritis",
          createdAt: daysAgo(5),
        },
        {
          doctorId: sampleDoctors[11]._id,
          name: "Tina Fey",
          age: 48,
          gender: "Female",
          phone: "+1-555-0222",
          email: "tina.f@example.com",
          condition: "General Checkup",
          createdAt: daysAgo(6),
        },
        {
          doctorId: sampleDoctors[11]._id,
          name: "Ulysses Grant",
          age: 60,
          gender: "Male",
          phone: "+1-555-0223",
          email: "ulysses.g@example.com",
          condition: "Hypertension",
          createdAt: daysAgo(4),
        },
        {
          doctorId: sampleDoctors[11]._id,
          name: "Victoria Secret",
          age: 33,
          gender: "Female",
          phone: "+1-555-0224",
          email: "victoria.s@example.com",
          condition: "General Checkup",
          createdAt: daysAgo(2),
        },
        {
          doctorId: sampleDoctors[0]._id,
          name: "Wyatt Earp",
          age: 54,
          gender: "Male",
          phone: "+1-555-0225",
          email: "wyatt.e@example.com",
          condition: "Hypertension",
          createdAt: daysAgo(1),
        },
      ]);

      console.log(`✅ Seeded ${sampleDoctors.length} doctors and 25 patients successfully!`);
    }
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}

// Allow direct CLI execution: npm run seed
const isDirectExecution =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.replace(/\\/g, "/").endsWith("seeds/index.ts");

if (isDirectExecution) {
  const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/doctorTracker";

  mongoose.connect(MONGO_URI).then(async () => {
    console.log("🔌 Connected to MongoDB Atlas...");
    await runSeeds(true);
    console.log("🎉 Seeding complete!");
    process.exit(0);
  });
}

export default runSeeds;
