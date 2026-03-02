import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  onModuleInit() {
    if (!admin.apps.length) {
      const configPath = path.join(
        process.cwd(),
        'finease-d7e51-firebase-adminsdk-fbsvc-d6c9c4d591.json',
      );
      console.log('Firebase config path:', configPath);
      const serviceAccount = JSON.parse(
        fs.readFileSync(configPath, 'utf8'),
      ) as admin.ServiceAccount;

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'finease-d7e51',
      });
    }
  }

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }

  getFirestore(): admin.firestore.Firestore {
    return admin.firestore();
  }
}
