const preState = { orderId: "ORD-104", status: "ACTIVE", refunded: false };
const actionResult = { accepted: true, trackingRef: "REF-8821" };
const postState = { orderId: "ORD-104", status: "ACTIVE", refunded: false };

const expected = { status: "CANCELED", refunded: true };

const passed =
  postState.status === expected.status &&
  postState.refunded === expected.refunded;

const receipt = {
  timestamp: new Date().toISOString(),
  action: "cancel_and_refund_order",
  preState,
  actionResult,
  postState,
  expected,
  verified: passed,
  finding: passed
    ? "State matches expected postcondition."
    : "Mismatch detected: postState did not reach expected values."
};

console.log(JSON.stringify(receipt, null, 2));

if (!passed) {
  process.exit(1);
}
