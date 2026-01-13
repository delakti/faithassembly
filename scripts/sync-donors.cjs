const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fauchurchconnect-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.database();      // Realtime Database (Donors)
const firestore = admin.firestore(); // Firestore (User Profiles)
const auth = admin.auth();

const DEFAULT_PASSWORD = 'FaithAssembly2024!';

async function syncDonors() {
  console.log('Starting donor sync (Auth + Firestore)...');
  
  try {
    const donorsRef = db.ref('donor');
    const snapshot = await donorsRef.once('value');
    const donors = snapshot.val();

    if (!donors) {
      console.log('No donors found in Realtime Database.');
      return;
    }

    let createdCount = 0;
    let profilesCreated = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const [key, donor] of Object.entries(donors)) {
      const email = donor.Email;
      
      if (!email) {
        console.log(`Skipping donor ${key}: No email address.`);
        continue;
      }

      console.log(`Processing ${donor['First Name']} ${donor['Last Name']} (${email})...`);
      let uid = donor.uid; // Check if we already linked a UID

      try {
        // 1. Ensure Auth Account Exists
        if (!uid) {
            try {
                const existingUser = await auth.getUserByEmail(email);
                uid = existingUser.uid;
                console.log(`  - Auth user already exists (${uid}).`);
                // Link it back to donor for future reference
                await donorsRef.child(key).update({ uid: uid });
            } catch (error) {
                if (error.code === 'auth/user-not-found') {
                    // Create user
                    const userData = {
                        email: email,
                        password: DEFAULT_PASSWORD,
                        displayName: `${donor['First Name']} ${donor['Last Name']}`,
                        emailVerified: true,
                    };

                    if (donor['Mobile Phone']) {
                        userData.phoneNumber = donor['Mobile Phone'];
                    }

                    try {
                        const userRecord = await auth.createUser(userData);
                        uid = userRecord.uid;
                        console.log(`  - Created new Auth user: ${uid}`);
                        await donorsRef.child(key).update({ uid: uid });
                        createdCount++;
                    } catch (createError) {
                         if (userData.phoneNumber && createError.message.includes('phone number')) {
                             console.log(`  - Invalid phone number, retrying without...`);
                             delete userData.phoneNumber;
                             const userRecordRetry = await auth.createUser(userData);
                             uid = userRecordRetry.uid;
                             console.log(`  - Created new Auth user (no phone): ${uid}`);
                             await donorsRef.child(key).update({ uid: uid });
                             createdCount++;
                        } else {
                            throw createError;
                        }
                    }
                } else {
                    throw error;
                }
            }
        }

        // 2. Ensure Firestore User Profile Exists
        if (uid) {
            const userDocRef = firestore.collection('users').doc(uid);
            const userDoc = await userDocRef.get();

            if (!userDoc.exists) {
                console.log(`  - Creating Firestore profile for ${uid}...`);
                await userDocRef.set({
                    uid: uid,
                    email: email,
                    displayName: `${donor['First Name']} ${donor['Last Name']}`,
                    role: 'user', // Default role
                    photoURL: '',
                    status: 'active',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    source: 'donor_sync'
                });
                profilesCreated++;
            } else {
                console.log(`  - Firestore profile already exists.`);
                skippedCount++;
            }
        }

      } catch (err) {
        console.error(`  - Error processing ${email}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n--- Sync Complete ---');
    console.log(`Auth Accounts Created: ${createdCount}`);
    console.log(`Firestore Profiles Created: ${profilesCreated}`);
    console.log(`Profiles Skipped (Existed): ${skippedCount}`);
    console.log(`Errors:  ${errorCount}`);

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    process.exit();
  }
}

syncDonors();
