export function MailPreview({ mail }) {

    const previewClass = `mail-preview ${mail.isRead ? 'read' : ''}`

    return (
        <li className={previewClass}>
            <span className="star">{mail.isStarred ? '★' : '☆'}</span>
            <span className="from">{mail.from}</span>
            <span className="subject">{mail.subject}</span>
            <span className="date">
                {new Date(mail.createdAt).toLocaleDateString()}
            </span>
        </li>
    )
}