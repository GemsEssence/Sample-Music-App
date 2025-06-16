/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

// Replace with your email config or use functions config vars
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gmail',
    pass: 'password 16'
  }
});

// Generate & send OTP
exports.sendPasswordResetOtp = functions.https.onCall(async (data) => {
  const { email } = data;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP in Firestore with short expiry (e.g. 5 mins)
  await db.collection('password_reset_otps').doc(email).set({
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  await transporter.sendMail({
    from: 'gmail',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`
  });

  return { success: true };
});

// Verify OTP
exports.verifyPasswordResetOtp = functions.https.onCall(async (data) => {
  const { email, otp } = data;

  const doc = await db.collection('password_reset_otps').doc(email).get();
  if (!doc.exists) throw new functions.https.HttpsError('not-found', 'OTP not found');

  const { otp: savedOtp, expiresAt } = doc.data();

  if (Date.now() > expiresAt) {
    throw new functions.https.HttpsError('deadline-exceeded', 'OTP expired');
  }

  if (otp !== savedOtp) {
    throw new functions.https.HttpsError('permission-denied', 'Invalid OTP');
  }

  return { verified: true };
});

// Set new password (after verification)
exports.setNewPassword = functions.https.onCall(async (data) => {
  const { email, newPassword } = data;

  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().updateUser(user.uid, { password: newPassword });

  // Clean up OTP
  await db.collection('password_reset_otps').doc(email).delete();

  return { success: true };
});
