const { useNavigate } = ReactRouterDOM

export function MailPreview({ mail, onUpdateMail }) {
    const navigate = useNavigate()
    const previewClass = `mail-preview ${mail.isRead ? 'read' : ''}`

    async function onOpenMail() {
        if (!mail.isRead) {
            await onUpdateMail({ ...mail, isRead: true })
        }
        navigate(`/mail/${mail.id}`)
    }

    function onToggleRead(ev) {
        ev.stopPropagation()

        const mailToUpdate = { ...mail, isRead: !mail.isRead }
        onUpdateMail(mailToUpdate)
    }

    function onToggleStar(ev) {
        ev.stopPropagation()

        const mailToUpdate = { ...mail, isStarred: !mail.isStarred }
        onUpdateMail(mailToUpdate)
    }

    return (
        <li className={previewClass} onClick={onOpenMail}>
            <span
                className={`star ${mail.isStarred ? 'starred' : ''}`}
                onClick={onToggleStar}
            >
                {mail.isStarred ? '★' : '☆'}
            </span>
            <span className="from">{mail.from}</span>
            <span className="subject">{mail.subject}</span>
            <div className="actions">
                <button onClick={onToggleRead} className="btn-icon">
                    {mail.isRead ? 'Unread' : 'Read'}
                </button>
            </div>

            <span className="date">
                {new Date(mail.createdAt).toLocaleDateString()}
            </span>
        </li>
    )
}

