import { MailPreview } from "./MailPreview.jsx"
const { useOutletContext } = ReactRouterDOM

export function MailList() {
    const { mails, onUpdateMail, onRemoveMail } = useOutletContext()

    if (!mails) return <div>Loading...</div>

    return (
        <section className="mail-list">
            <ul>
                {mails.map(mail => (
                    <MailPreview
                        key={mail.id}
                        mail={mail}
                        onUpdateMail={onUpdateMail}
                        onRemoveMail={onRemoveMail} />
                ))}
            </ul>
        </section>
    )
}
