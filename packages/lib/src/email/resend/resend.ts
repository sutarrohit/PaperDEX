import dotenv from "dotenv";
import { Resend } from "resend";
import { tryCatch } from "../../index";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async (to: string, subject: string, html: string) => {
    const result = await tryCatch(
        resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: [to],
            subject,
            html
        })
    );

    if (result.error) {
        console.log({ error: result.error });
    }
};
