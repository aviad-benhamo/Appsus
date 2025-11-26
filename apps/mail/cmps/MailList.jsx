import { MailPreview } from "./MailPreview.jsx"

export function MailList({ mails }) {

    return (
        <section className="mail-list">
            <ul>
                {mails.map(mail => (
                    <MailPreview key={mail.id} mail={mail} />
                ))}
            </ul>
        </section>
    )
}
