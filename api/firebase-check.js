import admin from "firebase-admin";

export default function handler(req, res) {
  return res.status(200).json({
    success: true,
    firebaseAdminInstalled: true,
    initialized: admin.apps.length > 0
  });
}
