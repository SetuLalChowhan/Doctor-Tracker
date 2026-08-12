import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { hashPassword } from "../utils/auth.util.js";

/**
 * Seed runner function executed on server startup
 */
export async function runSeeds(): Promise<void> {
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

    // 2. Seed Sample Doctors & Patients if Database is empty
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      console.log("🌱 Seeding sample doctor and patient data...");

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
      ]);

      // Seed patients under doctors
      await Patient.insertMany([
        {
          doctorId: sampleDoctors[0]._id,
          name: "John Doe",
          age: 45,
          gender: "Male",
          phone: "+1-555-0201",
          email: "john.doe@example.com",
          condition: "Hypertension",
        },
        {
          doctorId: sampleDoctors[0]._id,
          name: "Alice Smith",
          age: 62,
          gender: "Female",
          phone: "+1-555-0202",
          email: "alice.smith@example.com",
          condition: "Coronary Artery Disease",
        },
        {
          doctorId: sampleDoctors[1]._id,
          name: "Robert Johnson",
          age: 38,
          gender: "Male",
          phone: "+1-555-0203",
          email: "robert.j@example.com",
          condition: "Migraine",
        },
        {
          doctorId: sampleDoctors[2]._id,
          name: "Emily Davis",
          age: 8,
          gender: "Female",
          phone: "+1-555-0204",
          email: "parent.davis@example.com",
          condition: "Asthma",
        },
        {
          doctorId: sampleDoctors[3]._id,
          name: "David Miller",
          age: 52,
          gender: "Male",
          phone: "+1-555-0205",
          email: "david.m@example.com",
          condition: "Osteoarthritis",
        },
      ]);

      console.log("🌱 Sample doctors and patients seeded successfully!");
    }
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}

export default runSeeds;
