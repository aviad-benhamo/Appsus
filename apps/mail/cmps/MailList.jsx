export function MailList({ mails }) {

    return (
        <section>
            <ul>
                {mails.map(mail => (
                    <li key={mail.id} className="mail-preview-row">
                        <span className="star">{mail.isStarred ? '★' : '☆'}</span>
                        <span className="from">{mail.from}</span>
                        <span className="subject">{mail.subject}</span>
                        <span className="date">{new Date(mail.createdAt).toLocaleDateString()}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}
