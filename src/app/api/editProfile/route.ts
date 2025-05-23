import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
//   try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.userId) {
        
        // console.log('////****');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.userId;

    const formData = await req.formData();
    const avatar = formData.get('avatar') as File;

    let imagePath = '';
    if (avatar && avatar.size > 0) {
      const buffer = Buffer.from(await avatar.arrayBuffer());
      const fileName = `${uuidv4()}-${avatar.name}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');

      await mkdir(uploadDir, { recursive: true });
      await writeFile(`${uploadDir}/${fileName}`, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const fullProfile = {
      ...Object.fromEntries(formData.entries()),
      dob: new Date(formData.get('dob') as string),
      avatar: imagePath,
      userId: userId,
    };

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('profiles');

    await collection.updateOne(
      { userId: userId },
      { $set: fullProfile },
      { upsert: true }
    );

    return NextResponse.json({ success: true, profile: fullProfile });
//   } catch (error) {
//     console.error('Error saving profile:', error);
//     return NextResponse.json({ success: false, message: 'Failed to save profile' }, { status: 500 });
//   }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        // console.log("get");
        
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user.email;

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('profiles');

    const profile = await collection.findOne({ email: userEmail });

    return NextResponse.json({ profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
