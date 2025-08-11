import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://class-management-app-production.up.railway.app';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Assignment {
  _id: string;
  title: string;
  isPublished: boolean;
}

export async function GET() {
  try {
    // Fetch classes, users, and other data in parallel
    const [classesResponse, usersResponse, assignmentsResponse] = await Promise.all([
      fetch(`${BACKEND_URL}/api/classes`),
      fetch(`${BACKEND_URL}/api/users`),
      fetch(`${BACKEND_URL}/api/assignments`),
    ]);

    // Check if all responses are ok
    if (!classesResponse.ok || !usersResponse.ok || !assignmentsResponse.ok) {
      throw new Error('Failed to fetch data from backend');
    }

    const [classes, users, assignments] = await Promise.all([
      classesResponse.json(),
      usersResponse.json(),
      assignmentsResponse.json(),
    ]);

    // Calculate statistics
    const stats = {
      totalClasses: classes.length || 0,
      totalStudents: users.filter((user: User) => user.role === 'student').length || 0,
      totalTeachers: users.filter((user: User) => user.role === 'teacher').length || 0,
      activeAssignments: assignments.filter((assignment: Assignment) => assignment.isPublished).length || 0,
      averageGrade: 0, // This would need to be calculated from actual grades
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 