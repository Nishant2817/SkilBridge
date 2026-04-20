import bcrypt from "bcryptjs";
import prisma from "./config/db.js";

async function resetAdminPassword() {
  try {
    const newPassword = "adminpassword123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const admins = await prisma.user.findMany({
      where: { role: "admin" },
    });

    if (admins.length === 0) {
      console.log("❌ No admin users found in the database. Are you sure you have created one?");
      return;
    }

    // Update all admin accounts
    for (const admin of admins) {
      await prisma.user.update({
        where: { id: admin.id },
        data: { password: hashedPassword },
      });
      console.log(`✅ Password successfully reset for Admin: ${admin.email}`);
    }

    console.log(`🔑 Your new admin password is: ${newPassword}`);
  } catch (error) {
    console.error("❌ Error resetting admin password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
