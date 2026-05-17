import nodemailer from "nodemailer";

import dns from 'dns';

// Force IPv4 to prevent cloud IPv6 network crashes
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,     // 🚨 Port 2525 completely bypasses Render/Cloud firewall blocks!
  secure: false,  // false means STARTTLS (automatically upgrades to secure TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 15000,
  socketTimeout: 15000,
});

export default transporter;