
import admin from "firebase-admin";

export default function handler(req, res) {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      return res.status(500).json({
        success: false,
        message: "Firebase credentials are not configured"
      });
    }

    if (admin.apps.length === 0) {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    return res.status(200).json({
      success: true,
      firebaseAdminInstalled: true,
      initialized: true
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Firebase initialization failed"
    });
  }
}
