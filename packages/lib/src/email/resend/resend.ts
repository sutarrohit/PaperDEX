import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "noreply@paperdex.in",
            to: [to],
            subject,
            html
        });

        console.log("email response================>", data, error);

        if (error) throw Error(error.message);
    } catch (err) {
        console.error("Unexpected error while sending email:", err);
    }
};
