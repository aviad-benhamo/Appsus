const { useNavigate } = ReactRouterDOM

export function MailPreview({ mail }) {
    const navigate = useNavigate()
    const previewClass = `mail-preview ${mail.isRead ? 'read' : ''}`
    function onOpenMail() {
        navigate(`/mail/${mail.id}`)
    }

    return (
        <li className={previewClass} onClick={onOpenMail}>
            <span className="star">{mail.isStarred ? '★' : '☆'}</span>
            <span className="from">{mail.from}</span>
            <span className="subject">{mail.subject}</span>
            <span className="date">
                {new Date(mail.createdAt).toLocaleDateString()}
            </span>
        </li>
    )
}

