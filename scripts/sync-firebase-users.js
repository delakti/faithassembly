
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory equivalent to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function init() {
  try {
    const serviceAccountPath = join(__dirname, '../serviceAccountKey.json');
    const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();
    const auth = admin.auth();

    console.log('🚀 Starting User Sync...');
  
    const listUsersResult = await auth.listUsers(1000);
    const users = listUsersResult.users;
    
    console.log(`Found ${users.length} users in Authentication.`);
    
    let createdCount = 0;
    let existingCount = 0;

    for (const user of users) {
      const userRef = db.collection('users').doc(user.uid);
      const doc = await userRef.get();

      if (!doc.exists) {
        // Create new user document
        await userRef.set({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Unknown User',
          photoURL: user.photoURL || '',
          role: 'user', // Default role
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          syncedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`✅ Created profile for: ${user.email}`);
        createdCount++;
      } else {
          // Optional: Update existing to ensure email/name are fresh
          await userRef.update({
              email: user.email,
              displayName: user.displayName || doc.data().displayName || 'Unknown User',
              syncedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          existingCount++;
      }
    }

    console.log('-----------------------------------');
    console.log(`🎉 Sync Complete!`);
    console.log(`🆕 Created: ${createdCount}`);
    console.log(`♻️  Updated/Skipped: ${existingCount}`);
    
    process.exit(0);

  } catch (error) {
    console.error('Error during sync:', error);
    process.exit(1);
  }
}

init();
