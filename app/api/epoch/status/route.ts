import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const now = new Date().toISOString();

  const services = [
    {
      name: "Record書き込み",
      description: "新しいRecordの作成と確定",
      status: "operational",
      lastUpdated: now,
    },
    {
      name: "データベース",
      description: "Epochデータの保存と取得",
      status: "operational",
      lastUpdated: now,
    },
    {
      name: "認証サービス",
      description: "Passkey / Magic Link認証",
      status: "operational",
      lastUpdated: now,
    },
    {
      name: "APIサーバー",
      description: "アプリケーションバックエンド",
      status: "operational",
      lastUpdated: now,
    },
  ];

  const incidents: unknown[] = [];

  return NextResponse.json({ services, incidents, updatedAt: now });
}
