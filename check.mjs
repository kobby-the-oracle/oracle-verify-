import crypto from "node:crypto";

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function buildReceipt({ action, preState, actionResult, postState, expected, prevHash }) {
  const passed =
    postState.status === expected.status &&
    postState.refunded === expected.refunded;

  const base = {
    timestamp: new Date().toISOString(),
    action,
    preState,
    actionResult,
    postState,
    expected,
    verified: passed,
    finding: passed
      ? "State matches expected postcondition."
      : "Mismatch detected: postState did not reach expected values.",
    prevHash
  };

  const recordHash = sha256(JSON.stringify(base));
  return { ...base, recordHash };
}

const genesisHash = "0".repeat(64);

const r1 = buildReceipt({
  action: "cancel_and_refund_order",
  preState: { orderId: "ORD-103", status: "ACTIVE", refunded: false },
  actionResult: { accepted: true, trackingRef: "REF-8820" },
  postState: { orderId: "ORD-103", status: "CANCELED", refunded: true },
  expected: { status: "CANCELED", refunded: true },
  prevHash: genesisHash
});

const r2 = buildReceipt({
  action: "cancel_and_refund_order",
  preState: { orderId: "ORD-104", status: "ACTIVE", refunded: false },
  actionResult: { accepted: true, trackingRef: "REF-8821" },
  postState: { orderId: "ORD-104", status: "ACTIVE", refunded: false },
  expected: { status: "CANCELED", refunded: true },
  prevHash: r1.recordHash
});

console.log(JSON.stringify([r1, r2], null, 2));

if (!r1.verified || !r2.verified) {
  process.exit(1);
}
