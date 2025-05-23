import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { userId, password } = await req.json();

    if (!userId || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(); 
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ userId, password });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    
    
    const response = NextResponse.json({ message: 'Login successful', email: user.email });
    response.cookies.set('userEmail', user.email, {
      path: '/',
      httpOnly: false, 
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, 
    });
    console.log(user.email,"user.email");
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
