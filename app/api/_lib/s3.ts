import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID =
  process.env.ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID || "";
const AWS_SECRET_ACCESS_KEY =
  process.env.ACCESS_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY || "";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const BUCKET = process.env.AWS_LOGO_BUCKET || "logo-generator-parth";

export const s3 = new S3Client({
  region: AWS_REGION,
  credentials:
    AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

function dataUrlToBuffer(dataUrl: string): {
  buffer: Buffer;
  contentType: string;
} {
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!match) throw new Error("Invalid data URL for image upload");
  const contentType = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");
  return { buffer, contentType };
}

export async function uploadLogoDataUrl(params: {
  dataUrl: string;
  key: string;
  metadata?: Record<string, string>;
}): Promise<{ key: string; bucket: string }> {
  const { buffer, contentType } = dataUrlToBuffer(params.dataUrl);

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: params.key,
      Body: buffer,
      ContentType: contentType,
      Metadata: params.metadata,
    })
  );

  return { key: params.key, bucket: BUCKET };
}
