import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import * as fs from "fs";
import * as path from "path";

// Only initialize if running on the server and credentials exist
let adminApp: any;
let adminDb: any;
let adminAuth: any;

try {
  if (!getApps().length) {
    const serviceAccountContent = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const localKeyPath = path.join(process.cwd(), "service-account.json");

    let credentials: any;

    // 1. Try reading from environment variable first
    if (serviceAccountContent && serviceAccountContent.length > 2) {
      try {
        console.log("🔥 [admin.ts] Found FIREBASE_SERVICE_ACCOUNT_KEY in env. Parsing...");
        let sanitized = serviceAccountContent.trim();
        // Remove wrapping quotes if present
        if ((sanitized.startsWith("'") && sanitized.endsWith("'")) ||
          (sanitized.startsWith('"') && sanitized.endsWith('"'))) {
          sanitized = sanitized.slice(1, -1).trim();
        }
        credentials = JSON.parse(sanitized);
        console.log("✅ [admin.ts] Successfully parsed credentials from Env Var.");
      } catch (e) {
        console.warn("⚠️ [admin.ts] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY from env:", e);
      }
    }

    // 2. Fallback: Try reading from local file
    if (!credentials && fs.existsSync(localKeyPath)) {
      try {
        console.log("📂 [admin.ts] Found service-account.json at:", localKeyPath);
        const fileContent = fs.readFileSync(localKeyPath, "utf-8");
        credentials = JSON.parse(fileContent);
        console.log("✅ [admin.ts] Successfully parsed credentials from service-account.json");
      } catch (e) {
        console.error("❌ [admin.ts] Failed to parse service-account.json file:", e);
      }
    } else if (!credentials) {
      console.log("ℹ️ [admin.ts] No service-account.json found at:", localKeyPath);
    }

    if (credentials) {
      // 🚨 CRITICAL FIX: Ensure private_key has real newlines
      // Sometimes it comes in with literal \n characters (the two chars \ and n)
      if (credentials.private_key && typeof credentials.private_key === 'string') {
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
      }

      adminApp = initializeApp({
        credential: cert(credentials),
      });
      console.log("🔥 [admin.ts] Firebase Admin initialized successfully for project:", credentials.project_id);
    } else {
      console.warn("⚠️ [admin.ts] No Firebase credentials found. Using limited mode/build-stub.");
      adminApp = initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "build-stub" });
    }
  } else {
    adminApp = getApp();
  }

  // Ensure app is defined before getting services
  if (adminApp) {
    try {
      console.log("🔥 [admin.ts] Initializing Firestore...");
      adminDb = getFirestore(adminApp);
      // 🚨 FIX: Firestore doesn't like 'undefined' values by default.
      // This setting tells the SDK to just ignore them instead of crashing.
      adminDb.settings({ ignoreUndefinedProperties: true });
      console.log("✅ [admin.ts] Firestore initialized.");
    } catch (e) {
      console.error("❌ [admin.ts] Failed to initialize Firestore:", e);
    }

    try {
      console.log("🔥 [admin.ts] Initializing Auth...");
      adminAuth = getAuth(adminApp);
      console.log("✅ [admin.ts] Auth initialized. Object keys:", Object.keys(adminAuth || {}));
    } catch (e) {
      console.error("❌ [admin.ts] Failed to initialize Auth:", e);
    }
  }
} catch (error) {
  console.error("🚨 Firebase Admin Initialization Failure:", error);
  // Do not throw, allow exports to be undefined or stubbed so build can continue
}

export { adminDb, adminAuth };
