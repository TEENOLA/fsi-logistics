// Terminal validates that a phone number matches the country of its address,
// so numbers must be sent in international format: "+2348012345678",
// not "0801 234 5678" or "+1(555)839-2047".

const DIAL_CODES: Record<string, string> = {
  NG: "234",
  US: "1",
  CA: "1",
  GB: "44",
};

export function toInternationalPhone(
  rawPhone: string,
  countryCode: string
): string {
  const trimmed = rawPhone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  if (trimmed.startsWith("+")) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;

  const dialCode = DIAL_CODES[countryCode];
  if (!dialCode) return `+${digits}`;

  if (digits.startsWith(dialCode) && digits.length > 10) return `+${digits}`;

  const withoutTrunkZero = digits.startsWith("0") ? digits.slice(1) : digits;
  return `+${dialCode}${withoutTrunkZero}`;
}
