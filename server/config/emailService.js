import http from 'http';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});


async function sendMail(to, subject, text) {
    if (!to) {
        console.error("Recipient email address is required but not provided.");
        return { success: false, error: "Recipient email missing" };
    }
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending mail:", error);
        return { success: false, error: error.message };
    }
}

export default sendMail;

