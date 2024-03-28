import { UserRole } from "@prisma/client";

export default function parseUserRole(role: string): UserRole {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return UserRole.Student;
      case 'USER':
        return UserRole.TA;
      case 'MODERATOR':
        return UserRole.Lecturer;
      default:
        return UserRole.Student; // or handle invalid input accordingly
    }
}