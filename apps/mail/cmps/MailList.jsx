import { MailPreview } from "./MailPreview.jsx"
const { useOutletContext } = ReactRouterDOM

export function MailList() {
    const { mails, onUpdateMail } = useOutletContext()
    return (
        <section className="mail-list">
            <ul>
                {mails.map(mail => (
                    <MailPreview
                        key={mail.id}
                        mail={mail}
                        onUpdateMail={onUpdateMail} />
                ))}
            </ul>
        </section>
    )
}
