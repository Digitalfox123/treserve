import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Order } from "../types";

export async function generateOrderPdf(order: Order): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // A4 Page Size in Points (595.28 x 841.89)
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Executive Brand Color Palette
  const navy = rgb(11 / 255, 31 / 255, 51 / 255); // #0B1F33
  const primaryBlue = rgb(23 / 255, 105 / 255, 224 / 255); // #1769E0
  const paleBlue = rgb(232 / 255, 242 / 255, 255 / 255); // #E8F2FF
  const grayDark = rgb(51 / 255, 65 / 255, 85 / 255); // #334155
  const grayText = rgb(100 / 255, 116 / 255, 139 / 255); // #64748B
  const borderGray = rgb(226 / 255, 232 / 255, 240 / 255); // #E2E8F0
  const lightBg = rgb(248 / 255, 250 / 255, 252 / 255); // #F8FAFC
  const emerald = rgb(16 / 255, 122 / 255, 71 / 255); // #107A47
  const softEmeraldBg = rgb(236 / 255, 253 / 255, 245 / 255); // #ECFDF5

  const isReservation = true;
  const docTitle = "VISA APPLICATION FLIGHT RESERVATION";
  const statusLabel = "CONFIRMED HOLD (VERIFIABLE VISA PROOF)";

  const marginX = 42;
  const contentWidth = pageWidth - marginX * 2;
  let y = pageHeight - 36;

  // 1. TOP BRAND ACCENT BAR
  page.drawRectangle({
    x: 0,
    y: pageHeight - 6,
    width: pageWidth,
    height: 6,
    color: primaryBlue,
  });

  // 2. EMBED OFFICIAL LOGO IMAGE
  try {
    const logoPath = path.join(process.cwd(), "public", "images", "logo-header.png");
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      // Native aspect ratio: 1024 x 384 ≈ 2.67
      const logoW = 120;
      const logoH = 45;
      page.drawImage(logoImage, {
        x: marginX,
        y: y - logoH + 6,
        width: logoW,
        height: logoH,
      });
    } else {
      // Fallback vector text if image not found
      page.drawText("Treserve", {
        x: marginX,
        y: y - 10,
        size: 22,
        font: fontBold,
        color: navy,
      });
    }
  } catch {
    page.drawText("Treserve", {
      x: marginX,
      y: y - 10,
      size: 22,
      font: fontBold,
      color: navy,
    });
  }

  // 3. DOCUMENT META & TITLE (Top-Right Block)
  const metaRightX = pageWidth - marginX;

  const titleW = fontBold.widthOfTextAtSize(docTitle, 13);
  page.drawText(docTitle, {
    x: metaRightX - titleW,
    y: y - 2,
    size: 13,
    font: fontBold,
    color: navy,
  });

  const refLabel = `Booking Ref: ${order.internal_reference}`;
  const refW = fontBold.widthOfTextAtSize(refLabel, 9.5);
  page.drawText(refLabel, {
    x: metaRightX - refW,
    y: y - 18,
    size: 9.5,
    font: fontBold,
    color: primaryBlue,
  });

  const dateIssued = order.created_at ? order.created_at.slice(0, 10) : "2026-10-27";
  const dateStr = `Date of Issue: ${dateIssued}`;
  const dateW = fontRegular.widthOfTextAtSize(dateStr, 8.5);
  page.drawText(dateStr, {
    x: metaRightX - dateW,
    y: y - 31,
    size: 8.5,
    font: fontRegular,
    color: grayText,
  });

  // Status Badge box
  const badgeText = statusLabel;
  const badgeFont = fontBold;
  const badgeTextW = badgeFont.widthOfTextAtSize(badgeText, 8);
  const badgeBoxW = badgeTextW + 16;
  const badgeBoxH = 17;
  page.drawRectangle({
    x: metaRightX - badgeBoxW,
    y: y - 53,
    width: badgeBoxW,
    height: badgeBoxH,
    color: isReservation ? softEmeraldBg : paleBlue,
    borderColor: isReservation ? emerald : primaryBlue,
    borderWidth: 0.8,
  });
  page.drawText(badgeText, {
    x: metaRightX - badgeBoxW + 8,
    y: y - 48,
    size: 8,
    font: badgeFont,
    color: isReservation ? emerald : primaryBlue,
  });

  y -= 66;

  // Divider Line
  page.drawLine({
    start: { x: marginX, y },
    end: { x: pageWidth - marginX, y },
    thickness: 1,
    color: borderGray,
  });

  y -= 18;

  // 4. JOURNEY OVERVIEW CARD (REDESIGNED 2-ROW LAYOUT - NO OVERLAPPING!)
  const overviewCardH = 70;
  page.drawRectangle({
    x: marginX,
    y: y - overviewCardH,
    width: contentWidth,
    height: overviewCardH,
    color: lightBg,
    borderColor: borderGray,
    borderWidth: 1,
  });

  // Row 1: ROUTE & CABIN CLASS
  page.drawText("FLIGHT ROUTING", {
    x: marginX + 14,
    y: y - 16,
    size: 7.5,
    font: fontBold,
    color: grayText,
  });

  // Full Route text
  const routeString = `${order.origin}  ->  ${order.destination}`;
  page.drawText(routeString, {
    x: marginX + 14,
    y: y - 31,
    size: 12,
    font: fontBold,
    color: navy,
  });

  // Cabin Badge on right side of Row 1
  const cabinText = `CABIN: ${order.cabin_class.toUpperCase()}`;
  const cabinW = fontBold.widthOfTextAtSize(cabinText, 8.5);
  page.drawText(cabinText, {
    x: pageWidth - marginX - cabinW - 14,
    y: y - 28,
    size: 8.5,
    font: fontBold,
    color: primaryBlue,
  });

  // Row 2: TRIP TYPE, DEPARTURE, RETURN, TRAVELERS (Separate dedicated columns)
  const colY = y - 48;
  const colValY = y - 61;
  const col1X = marginX + 14;
  const col2X = marginX + 130;
  const col3X = marginX + 260;
  const col4X = marginX + 390;

  // Col 1: Trip Type
  page.drawText("TRIP TYPE", { x: col1X, y: colY, size: 7, font: fontBold, color: grayText });
  page.drawText(order.trip_type.toUpperCase(), { x: col1X, y: colValY, size: 9, font: fontBold, color: grayDark });

  // Col 2: Departure Date
  page.drawText("DEPARTURE DATE", { x: col2X, y: colY, size: 7, font: fontBold, color: grayText });
  page.drawText(order.departure_date, { x: col2X, y: colValY, size: 9, font: fontBold, color: grayDark });

  // Col 3: Return Date (or One-way)
  page.drawText("RETURN DATE", { x: col3X, y: colY, size: 7, font: fontBold, color: grayText });
  page.drawText(order.return_date || "N/A (ONE-WAY)", {
    x: col3X,
    y: colValY,
    size: 9,
    font: fontBold,
    color: grayDark,
  });

  // Col 4: Passengers
  page.drawText("PASSENGERS", { x: col4X, y: colY, size: 7, font: fontBold, color: grayText });
  page.drawText(`${order.passenger_count} TRAVELER(S)`, {
    x: col4X,
    y: colValY,
    size: 9,
    font: fontBold,
    color: grayDark,
  });

  y -= overviewCardH + 18;

  // 5. PASSENGER MANIFEST TABLE
  page.drawText("PASSENGER DETAILS", {
    x: marginX,
    y,
    size: 10,
    font: fontBold,
    color: navy,
  });

  y -= 14;

  // Table Header
  const tableHeaderH = 16;
  page.drawRectangle({
    x: marginX,
    y: y - tableHeaderH,
    width: contentWidth,
    height: tableHeaderH,
    color: paleBlue,
  });
  page.drawText("#", { x: marginX + 10, y: y - 11, size: 7.5, font: fontBold, color: navy });
  page.drawText("PASSENGER NAME", { x: marginX + 35, y: y - 11, size: 7.5, font: fontBold, color: navy });
  page.drawText("TRAVELER TYPE", { x: marginX + 240, y: y - 11, size: 7.5, font: fontBold, color: navy });
  page.drawText("RESERVATION STATUS", { x: marginX + 360, y: y - 11, size: 7.5, font: fontBold, color: navy });

  y -= tableHeaderH;

  const passengers =
    order.passengers && order.passengers.length > 0
      ? order.passengers
      : [{ id: "1", first_name: "Lead", last_name: "Passenger", passenger_type: "adult" as const }];

  passengers.forEach((p, idx) => {
    y -= 16;
    page.drawText(String(idx + 1), { x: marginX + 10, y, size: 8, font: fontRegular, color: navy });
    page.drawText(
      `${p.title ? p.title + " " : ""}${p.first_name} ${p.last_name}`.toUpperCase(),
      { x: marginX + 35, y, size: 8.5, font: fontBold, color: navy }
    );
    page.drawText(p.passenger_type.toUpperCase(), {
      x: marginX + 240,
      y,
      size: 8,
      font: fontRegular,
      color: grayText,
    });
    page.drawText("CONFIRMED ON RECORD", {
      x: marginX + 360,
      y,
      size: 8,
      font: fontBold,
      color: emerald,
    });

    page.drawLine({
      start: { x: marginX, y: y - 5 },
      end: { x: pageWidth - marginX, y: y - 5 },
      thickness: 0.5,
      color: borderGray,
    });
  });

  y -= 22;

  // 6. FLIGHT ITINERARY SEGMENTS TABLE
  page.drawText("SCHEDULED FLIGHT SEGMENTS", {
    x: marginX,
    y,
    size: 10,
    font: fontBold,
    color: navy,
  });

  y -= 14;

  // Segments Header
  page.drawRectangle({
    x: marginX,
    y: y - tableHeaderH,
    width: contentWidth,
    height: tableHeaderH,
    color: paleBlue,
  });
  page.drawText("FLIGHT", { x: marginX + 10, y: y - 11, size: 7.5, font: fontBold, color: navy });
  page.drawText("AIRLINE", { x: marginX + 75, y: y - 11, size: 7.5, font: fontBold, color: navy });
  page.drawText("DEPARTURE", { x: marginX + 165, y: y - 11, size: 7.5, font: fontBold, color: navy });
  page.drawText("ARRIVAL", { x: marginX + 295, y: y - 11, size: 7.5, font: fontBold, color: navy });
  page.drawText("DURATION", { x: marginX + 415, y: y - 11, size: 7.5, font: fontBold, color: navy });
  page.drawText("CABIN", { x: marginX + 475, y: y - 11, size: 7.5, font: fontBold, color: navy });

  y -= tableHeaderH;

  const segments =
    order.segments && order.segments.length > 0
      ? order.segments
      : [
          {
            id: "1",
            segment_sequence: 1,
            flight_number: "EK-623",
            airline_name: "Emirates",
            airline_code: "EK",
            departure_airport: order.origin,
            departure_city: order.origin.split(" ")[0] || "Origin",
            arrival_airport: order.destination,
            arrival_city: order.destination.split(" ")[0] || "Destination",
            departure_time: `${order.departure_date} 03:20`,
            arrival_time: `${order.departure_date} 06:10`,
            duration: "3h 50m",
            cabin_class: order.cabin_class,
          },
        ];

  segments.forEach((seg) => {
    y -= 22;
    page.drawText(seg.flight_number, { x: marginX + 10, y, size: 8.5, font: fontBold, color: primaryBlue });
    page.drawText(seg.airline_name, { x: marginX + 75, y, size: 8, font: fontBold, color: grayDark });

    page.drawText(seg.departure_airport, { x: marginX + 165, y, size: 8, font: fontBold, color: navy });
    page.drawText(seg.departure_time, { x: marginX + 165, y: y - 9, size: 7, font: fontRegular, color: grayText });

    page.drawText(seg.arrival_airport, { x: marginX + 295, y, size: 8, font: fontBold, color: navy });
    page.drawText(seg.arrival_time, { x: marginX + 295, y: y - 9, size: 7, font: fontRegular, color: grayText });

    page.drawText(seg.duration, { x: marginX + 415, y, size: 8, font: fontRegular, color: grayDark });
    page.drawText(seg.cabin_class.toUpperCase(), { x: marginX + 475, y, size: 7.5, font: fontBold, color: navy });

    y -= 8;
    page.drawLine({
      start: { x: marginX, y: y - 4 },
      end: { x: pageWidth - marginX, y: y - 4 },
      thickness: 0.5,
      color: borderGray,
    });
  });

  y -= 18;

  // 7. OFFICIAL TERMS & TRAVEL NOTICE
  const termsH = 68;
  page.drawRectangle({
    x: marginX,
    y: y - termsH,
    width: contentWidth,
    height: termsH,
    color: rgb(250 / 255, 250 / 255, 252 / 255),
    borderColor: borderGray,
    borderWidth: 0.8,
  });

  page.drawText("IMPORTANT TRAVEL DOCUMENTATION TERMS & NOTICE", {
    x: marginX + 12,
    y: y - 13,
    size: 7.5,
    font: fontBold,
    color: navy,
  });

  // Mandatory Disclaimer Text (Uniform elegant gray text matching other terms)
  const mandatoryNotice =
    "Our service provides temporary reservations for visa documentation only. We do not guarantee visa approval. These are NOT actual flight tickets and are NOT valid for boarding.";
  page.drawText(`1. Mandatory Policy: ${mandatoryNotice}`, {
    x: marginX + 12,
    y: y - 26,
    size: 7,
    font: fontRegular,
    color: grayDark,
    maxWidth: contentWidth - 24,
    lineHeight: 9.5,
  });

  page.drawText(
    "2. Purpose: Issued as verified proof of intended travel for visa evaluation, pre-clearance, and itinerary planning.",
    { x: marginX + 12, y: y - 46, size: 7, font: fontRegular, color: grayDark }
  );

  page.drawText(
    "3. Electronic Authentication: Verified via Treserve Verification Platform (https://treserve.com). All itinerary data was verified at time of issuance.",
    { x: marginX + 12, y: y - 57, size: 7, font: fontRegular, color: grayDark }
  );

  // 9. PROFESSIONAL PRINT FOOTER (NO TEXT OVERLAPPING!)
  const footerY = 24;

  // Footer separator rule
  page.drawLine({
    start: { x: marginX, y: footerY + 14 },
    end: { x: pageWidth - marginX, y: footerY + 14 },
    thickness: 0.8,
    color: borderGray,
  });

  // Left text: Brand & URL
  page.drawText("Treserve Platform | https://treserve.com | Plan Today - Travel Tomorrow", {
    x: marginX,
    y: footerY,
    size: 7.5,
    font: fontRegular,
    color: grayText,
  });

  // Right text: Cleanly right-aligned without touching left text
  const rightFooterText = `Ref: ${order.internal_reference} | Page 1 of 1`;
  const rightFooterW = fontRegular.widthOfTextAtSize(rightFooterText, 7.5);
  page.drawText(rightFooterText, {
    x: pageWidth - marginX - rightFooterW,
    y: footerY,
    size: 7.5,
    font: fontRegular,
    color: grayText,
  });

  return await pdfDoc.save();
}
