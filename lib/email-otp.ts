import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "crypto";

export const OTP_EXPIRY_MS = 10 * 60 * 1000;
export const OTP_RESEND_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

export function normalizeEmail(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

export function challengeId(email: string) {
  return createHash("sha256")
    .update(email)
    .digest("hex");
}

export function hashOtp(
  email: string,
  otp: string
) {
  const secret = process.env.EMAIL_OTP_SECRET;

  if (!secret) {
    throw new Error(
      "EMAIL_OTP_SECRET is not configured"
    );
  }

  return createHmac("sha256", secret)
    .update(`${email}:${otp}`)
    .digest("hex");
}

export function otpMatches(
  expectedHash: string,
  submittedHash: string
) {
  const expected = Buffer.from(
    expectedHash,
    "hex"
  );

  const submitted = Buffer.from(
    submittedHash,
    "hex"
  );

  if (expected.length !== submitted.length) {
    return false;
  }

  return timingSafeEqual(
    expected,
    submitted
  );
}
