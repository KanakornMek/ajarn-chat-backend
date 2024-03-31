import { UserRole } from "@prisma/client";

export default function parseUserRole(role: string): UserRole {
    switch (role.toUpperCase()) {
      case 'STUDENT':
        return UserRole.Student;
      case 'TA':
        return UserRole.TA;
      case 'LECTURER':
        return UserRole.Lecturer;
      default:
        return UserRole.Student; // or handle invalid input accordingly
    }
}