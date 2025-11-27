const { useNavigate } = ReactRouterDOM

export function MailPreview({ mail, onUpdateMail, onRemoveMail }) {
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

    function onRemove(ev) {
        ev.stopPropagation()
        onRemoveMail(mail.id)
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
                <button onClick={onRemove} className="btn-icon" title="Delete">
                    🗑️
                </button>

                <button onClick={onToggleRead} className="btn-icon" title={mail.isRead ? 'Mark as unread' : 'Mark as read'}>
                    {mail.isRead ? '📩' : '📧'}
                </button>
            </div>

            <span className="date">
                {new Date(mail.createdAt).toLocaleDateString()}
            </span>
        </li>
    )
}

