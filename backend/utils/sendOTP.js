const nodemailer = require('nodemailer');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email, otp, userName) => {
  try {
    // If email config not set, log to console (dev mode)
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📧 OTP for ${email}: ${otp}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return { success: true, mode: 'console' };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '🔐 CoreInventory - Password Reset OTP',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 16px;">
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📦 CoreInventory</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Inventory Management System</p>
          </div>

          <div style="background: white; padding: 28px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
            <h2 style="color: #1e293b; font-size: 20px; margin: 0 0 8px;">Password Reset Request</h2>
            <p style="color: #64748b; font-size: 14px; margin: 0 0 24px;">Hi ${userName || 'User'}, use the OTP below to reset your password.</p>

            <div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="color: #64748b; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
              <h1 style="color: #4f46e5; font-size: 48px; font-weight: 800; letter-spacing: 12px; margin: 0;">${otp}</h1>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px;">
              <p style="color: #92400e; font-size: 13px; margin: 0;">⏰ This OTP expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
            </div>
          </div>

          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, mode: 'email' };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { generateOTP, sendOTP };
