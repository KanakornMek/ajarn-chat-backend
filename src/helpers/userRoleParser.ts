import { UserRole } from "@prisma/client";

export default function parseUserRole(role: string): UserRole {
    switch (role.toUpperCase()) {
      case 'Student':
        return UserRole.Student;
      case 'TA':
        return UserRole.TA;
      case 'Lecturer':
        return UserRole.Lecturer;
      default:
        return UserRole.Student; // or handle invalid input accordingly
    }
}