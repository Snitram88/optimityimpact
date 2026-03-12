/* =========================
SECTION: CONTACT FORM (OPTIMITY WEBSITE)
========================= */

app.post("/api/contact", async (req, res) => {
  const {
    fullName,
    organization,
    email,
    interestArea,
    message
  } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please complete required fields."
    });
  }

  try {
    const sql = `
      INSERT INTO contact_messages
      (
        full_name,
        organization,
        email,
        interest_area,
        message
      )
      VALUES ($1, $2, $3, $4, $5)
    `;

    await pool.query(sql, [
      fullName,
      organization || "",
      email,
      interestArea || "",
      message
    ]);

    try {
      await sendNotificationEmail(
        "New Optimity Website Enquiry",
        `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
          <p><strong>Organization:</strong> ${escapeHtml(organization || "")}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Interest Area:</strong> ${escapeHtml(interestArea || "")}</p>
          <p><strong>Message:</strong><br>${escapeHtml(message)}</p>
        `
      );

      return res.json({
        success: true,
        message: "Message sent successfully."
      });
    } catch (mailError) {
      console.error("Contact email error:", mailError);

      return res.json({
        success: true,
        message: "Message saved, but email notification failed."
      });
    }
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message."
    });
  }
});