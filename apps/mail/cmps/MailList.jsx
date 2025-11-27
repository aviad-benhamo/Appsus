import { MailPreview } from "./MailPreview.jsx"
const { useOutletContext } = ReactRouterDOM

export function MailList() {
    const { mails } = useOutletContext()
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
