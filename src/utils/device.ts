// User-agent based check rather than screen width — width alone misfires on
// tablets and resized desktop browser windows. This asks "does this device
// plausibly have WhatsApp installed and ready to open," not "how wide is the
// viewport right now."
export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
