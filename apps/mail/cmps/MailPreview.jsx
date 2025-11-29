const { useNavigate } = ReactRouterDOM

export function MailPreview({ mail, onUpdateMail, onRemoveMail, onEditDraft }) {
    const navigate = useNavigate()
    const previewClass = `mail-preview ${mail.isRead ? 'read' : ''}`

    async function onOpenMail() {
        if (!mail.sentAt) {
            onEditDraft(mail)
        } else {
            if (!mail.isRead) {
                await onUpdateMail({ ...mail, isRead: true })
            }
            navigate(`/mail/${mail.id}`)
        }
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

    function getFormattedDate(dateTs) {
        const date = new Date(dateTs)
        return date.toLocaleDateString('en-US', {
            month: 'short', // 'Nov'
            day: 'numeric'  // '20'
        })
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
                <button onClick={onRemove} className="btn-icon" title="Delete">🗑️</button>

                {mail.sentAt && (
                    <button onClick={onToggleRead} className="btn-icon" title={mail.isRead ? "Mark as unread" : "Mark as read"}>
                        <i className={`fa-regular ${mail.isRead ? 'fa-envelope' : 'fa-envelope-open'}`}></i>
                    </button>
                )}
            </div>

            <span className="date">
                {mail.sentAt
                    ? getFormattedDate(mail.sentAt)
                    : <span style={{ color: '#c0392b', fontStyle: 'italic' }}>Draft</span>
                }
            </span>
        </li>
    )
}

