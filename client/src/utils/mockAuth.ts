// Mock user database for demonstration
// In production, this would be replaced with actual API calls

export interface MockUser {
  email: string;
  password: string;
  role: 'admin' | 'teacher';
  name: string;
}

const mockUsers: MockUser[] = [
  // Admin users
  {
    email: 'admin@school.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
  },
  {
    email: 'principal@school.com',
    password: 'principal123',
    role: 'admin',
    name: 'Principal Johnson',
  },
  // Teacher users
  {
    email: 'robert.smith@teacher.school.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'Dr. Robert Smith',
  },
  {
    email: 'emily.johnson@teacher.school.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'Prof. Emily Johnson',
  },
  {
    email: 'sarah.williams@teacher.school.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'Ms. Sarah Williams',
  },
];

export function authenticateUser(email: string, password: string): MockUser | null {
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user || null;
}

// Helper function to get user role suggestion based on email pattern
export function getUserRoleSuggestion(email: string): string {
  if (email.includes('admin') || email.includes('principal') || email.includes('teacher')) {
    return 'Admin accounts typically use: admin@school.com or principal@school.com';
  } else if (email.includes('student')) {
    return 'Student accounts use format: firstname.lastname@student.school.com';
  }
  return '';
}

