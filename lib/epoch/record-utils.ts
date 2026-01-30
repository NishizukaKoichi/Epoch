export type EpochApiRecord = {
  recordId: string;
  userId: string;
  recordedAt: string;
  recordType: string;
  payload: Record<string, unknown> | unknown[];
  prevHash: string | null;
  recordHash: string;
  visibility: "private" | "scout_visible" | "public";
  attachments?: { attachmentHash: string; storagePointer: string }[];
};

export type EpochRecordView = {
  id: string;
  type:
    | "decision_made"
    | "decision_not_made"
    | "revised"
    | "period_of_silence"
    | "invited"
    | "declined"
    | "auth_recovered";
  content: string;
  timestamp: string;
  hash: string;
  prevHash: string;
  visibility: "private" | "scout_visible" | "public";
  attachment?: {
    type: string;
    name: string;
  };
  referencedRecordId?: string;
};

function stringifyPayload(payload: Record<string, unknown> | unknown[]): string {
  if (Array.isArray(payload)) {
    return JSON.stringify(payload);
  }
  if (!payload || typeof payload !== "object") {
    return "";
  }
  if (typeof (payload as Record<string, unknown>).content === "string") {
    return (payload as Record<string, unknown>).content as string;
  }
  if (typeof (payload as Record<string, unknown>).text === "string") {
    return (payload as Record<string, unknown>).text as string;
  }
  return JSON.stringify(payload);
}

function extractReference(payload: Record<string, unknown> | unknown[]): string | undefined {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return undefined;
  }
  const value = (payload as Record<string, unknown>).target_record_id;
  if (typeof value === "string") {
    return value;
  }
  const alt = (payload as Record<string, unknown>).reference_record_id;
  if (typeof alt === "string") {
    return alt;
  }
  return undefined;
}

export function mapRecordToView(record: EpochApiRecord): EpochRecordView {
  const content = stringifyPayload(record.payload);
  const attachment = record.attachments?.[0];
  const attachmentView = attachment
    ? {
        type: "image",
        name: attachment.storagePointer,
      }
    : undefined;

  return {
    id: record.recordId,
    type: record.recordType as EpochRecordView["type"],
    content,
    timestamp: record.recordedAt,
    hash: record.recordHash,
    prevHash: record.prevHash ?? "0000000000000000000000000000000",
    visibility: record.visibility,
    attachment: attachmentView,
    referencedRecordId: extractReference(record.payload),
  };
}
