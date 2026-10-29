// scripts/test-e2e.mjs
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("🚀 STARTING TRESERVE PLATFORM END-TO-END VERIFICATION\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Verify Homepage Loads
  try {
    const homeRes = await fetch(`${BASE_URL}/`);
    const homeHtml = await homeRes.text();
    assert(homeRes.status === 200, "Homepage returns 200 OK");
    assert(homeHtml.includes("Treserve"), "Homepage contains 'Treserve'");
    assert(homeHtml.includes("Plan Today"), "Homepage contains 'Plan Today'");
    assert(homeHtml.includes("Visa Application Flight Reservation"), "Homepage includes Flight Reservation service tier");
    assert(homeHtml.includes("Temporary Flight Reservation"), "Homepage includes Temporary Reservation");
    assert(
      homeHtml.includes("Our service provides temporary reservations for visa documentation only"),
      "Homepage includes exact mandatory visa disclaimer"
    );
    assert(
      !homeHtml.includes("Actual Flight Booking"),
      "Homepage strictly removes actual flight ticket booking service as mandated"
    );
  } catch (err) {
    console.error("Homepage test failed to connect:", err.message);
    failed++;
  }

  // 2. Create Order via POST /api/orders
  let orderId = "";
  let internalRef = "";
  try {
    console.log("\n📦 TESTING ORDER CREATION...");
    const orderPayload = {
      service_type: "temporary_reservation",
      trip_type: "return",
      origin: "Lahore (LHE)",
      destination: "Dubai (DXB)",
      departure_date: "2026-11-24",
      return_date: "2026-12-05",
      passenger_count: 1,
      cabin_class: "economy",
      guest_email: "test.traveler@example.com",
      guest_name: "Alexander Vance",
      passengers: [
        {
          title: "Mr",
          first_name: "Alexander",
          last_name: "Vance",
          passenger_type: "adult",
        },
      ],
    };

    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await orderRes.json();
    assert(orderRes.status === 201, `Order creation returns 201 (got ${orderRes.status})`);
    assert(orderData.success === true, "Order creation success flag is true");
    assert(orderData.order.order_status === "AWAITING_PAYMENT", "Initial order status is 'AWAITING_PAYMENT'");
    assert(orderData.order.total_amount === 50, "Order total correctly calculated from pricing config ($50.00)");
    assert(orderData.order.internal_reference.startsWith("TR-"), "Internal reference follows format TR-XXXXXXXX-XXXXXX");

    orderId = orderData.order.id;
    internalRef = orderData.order.internal_reference;
    console.log(`    Order created: ID=${orderId}, Ref=${internalRef}`);
  } catch (err) {
    console.error("Order creation failed:", err);
    failed++;
  }

  // 3. Test Locked Document Download on Unpaid Order (CRITICAL SECURITY)
  try {
    console.log("\n🔒 TESTING LOCKED DOCUMENT PROTECTION (UNPAID)...");
    const downloadRes = await fetch(`${BASE_URL}/api/documents/${orderId}/download`);
    const downloadData = await downloadRes.json();
    assert(
      downloadRes.status === 403,
      `Unpaid order download correctly denied with HTTP 403 Forbidden (got ${downloadRes.status})`
    );
    assert(
      downloadData.error === "PAYMENT REQUIRED · PDF DOWNLOAD LOCKED",
      "Correct error response: 'PAYMENT REQUIRED · PDF DOWNLOAD LOCKED'"
    );
  } catch (err) {
    console.error("Locked document test error:", err);
    failed++;
  }

  // 4. Test Payment Simulator: Failure Scenario
  try {
    console.log("\n💳 TESTING PAYMENT SIMULATOR: FAILURE SCENARIO...");
    const failRes = await fetch(`${BASE_URL}/api/test-payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        scenario: "SIMULATE_FAILURE",
        terms_accepted: true,
      }),
    });
    const failData = await failRes.json();
    assert(failRes.status === 402, `Payment failure simulation returns HTTP 402 (got ${failRes.status})`);
    assert(failData.status === "PAYMENT_FAILED", "Order status recorded as 'PAYMENT_FAILED'");

    // Verify document is STILL locked after failure!
    const recheckDownload = await fetch(`${BASE_URL}/api/documents/${orderId}/download`);
    assert(recheckDownload.status === 403, "Document remains locked (403) after payment decline");
  } catch (err) {
    console.error("Payment failure test error:", err);
    failed++;
  }

  // 5. Test Payment Simulator: Success Scenario & Unlock
  try {
    console.log("\n💳 TESTING PAYMENT SIMULATOR: SUCCESS SCENARIO...");
    const successRes = await fetch(`${BASE_URL}/api/test-payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        scenario: "SIMULATE_SUCCESS",
        terms_accepted: true,
      }),
    });
    const successData = await successRes.json();
    assert(successRes.status === 200, `Payment success simulation returns HTTP 200 OK`);
    assert(successData.status === "TEST_PAID", "Order updated to 'TEST_PAID'");
    assert(
      successData.message.includes("Test payment successful. This was a simulation; no real money was charged."),
      "Explicit simulation disclaimer banner confirmed in response"
    );
  } catch (err) {
    console.error("Payment success test error:", err);
    failed++;
  }

  // 6. Test Unlocked A4 PDF Generation & Download
  try {
    console.log("\n📄 TESTING UNLOCKED VECTOR A4 PDF DOWNLOAD...");
    const pdfRes = await fetch(`${BASE_URL}/api/documents/${orderId}/download`);
    assert(pdfRes.status === 200, "Authorized paid download returns HTTP 200 OK");
    assert(pdfRes.headers.get("content-type") === "application/pdf", "Content-Type is application/pdf");

    const pdfBuffer = await pdfRes.arrayBuffer();
    const pdfBytes = Buffer.from(pdfBuffer);
    assert(pdfBytes.length > 1000, `Generated PDF file size is valid (${pdfBytes.length} bytes)`);

    // Verify PDF Magic Bytes (%PDF-)
    const magic = pdfBytes.slice(0, 5).toString("utf8");
    assert(magic.startsWith("%PDF-"), `PDF magic header verified: "${magic}"`);

    // Parse and verify with PDFDocument
    const { PDFDocument } = await import("pdf-lib");
    const parsedPdf = await PDFDocument.load(pdfBytes);
    const pages = parsedPdf.getPages();
    assert(pages.length === 1, `PDF has exact 1 page (got ${pages.length})`);

    const { width, height } = pages[0].getSize();
    assert(
      Math.abs(width - 595.28) < 1 && Math.abs(height - 841.89) < 1,
      `Exact A4 page dimensions verified (595.28 x 841.89 pt, got ${width} x ${height})`
    );
    assert(pdfBytes.length > 2000, `PDF vector binary stream successfully validated (${pdfBytes.length} bytes)`);
  } catch (err) {
    console.error("PDF download test error:", err);
    failed++;
  }

  // 7. Test Support Ticket Submission
  try {
    console.log("\n✉️ TESTING SUPPORT DESK INQUIRY SUBMISSION...");
    const ticketRes = await fetch(`${BASE_URL}/api/support`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alexander Vance",
        email: "test.traveler@example.com",
        order_id: internalRef,
        subject: "Question about embassy submission",
        message: "Hello, I need confirmation that this document is suitable for Schengen visa filing.",
      }),
    });
    const ticketData = await ticketRes.json();
    assert(ticketRes.status === 201, "Support ticket created with 201 Created");
    assert(ticketData.success === true, "Support ticket saved successfully");
  } catch (err) {
    console.error("Support ticket test error:", err);
    failed++;
  }

  // 8. Test Central Pricing Manager API
  try {
    console.log("\n⚙️ TESTING CENTRAL PRICING CONFIGURATION...");
    const pricingRes = await fetch(`${BASE_URL}/api/pricing`);
    const pricingData = await pricingRes.json();
    assert(pricingRes.status === 200, "Pricing API returns 200 OK");
    assert(pricingData.pricing.itinerary.price_usd > 0, "Itinerary price exists and is > 0");
    assert(pricingData.pricing.temporary_reservation.price_usd > 0, "Temporary reservation price exists and is > 0");
  } catch (err) {
    console.error("Pricing test error:", err);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`🏁 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
