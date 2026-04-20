import prisma from "./config/db.js";

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide the email address of the user to make an admin.");
    console.log("Usage: node makeAdmin.js <user-email>");
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });
    console.log(`Successfully updated ${user.username} (${user.email}) to admin role!`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.error(`User with email ${email} not found.`);
    } else {
      console.error("Error updating user:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
