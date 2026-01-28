import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { getApps } from "firebase-admin/app";
import * as fs from "fs";
import * as path from "path";

export const dynamic = 'force-dynamic';

export async function GET() {
  const localKeyPath = path.join(process.cwd(), "service-account.json");
  const fileExists = fs.existsSync(localKeyPath);
  const envVarLength = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.length || 0;

  const apps = getApps().map(app => app.name);

  return NextResponse.json({
    status: "Debug Report",
    adminAuthDefined: !!adminAuth,
    adminDbDefined: !!adminDb,
    appsInitialized: apps,
    credentials: {
      fileFound: fileExists,
      filePath: localKeyPath,
      envVarLength: envVarLength,
    },
    env: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }
  });
}
