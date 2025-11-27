
export function MailFolderList({ filterBy, onSetFilter }) {

    return (
        <nav className="mail-folder-list">

            <div
                className={`folder-link ${filterBy.status === 'inbox' && filterBy.isRead === '' ? 'active' : ''}`}
                onClick={() => onSetFilter({ status: 'inbox', isRead: '' })}
            >
                <span className="icon">📥</span> Inbox
            </div>

            <div
                className={`folder-link ${filterBy.isRead === false ? 'active' : ''}`}
                onClick={() => onSetFilter({ status: 'inbox', isRead: false })}
            >
                <span className="icon">✉️</span> Unread
            </div>

            <div
                className={`folder-link ${filterBy.status === 'starred' ? 'active' : ''}`}
                onClick={() => onSetFilter({ status: 'starred', isRead: '' })}
            >
                <span className="icon">⭐️</span> Starred
            </div>

            <div
                className={`folder-link ${filterBy.status === 'sent' ? 'active' : ''}`}
                onClick={() => onSetFilter({ status: 'sent', isRead: '' })}
            >
                <span className="icon">📤</span> Sent
            </div>

            <div
                className={`folder-link ${filterBy.status === 'draft' ? 'active' : ''}`}
                onClick={() => onSetFilter({ status: 'draft', isRead: '' })}
            >
                <span className="icon">📄</span> Drafts
            </div>

            <div
                className={`folder-link ${filterBy.status === 'trash' ? 'active' : ''}`}
                onClick={() => onSetFilter({ status: 'trash', isRead: '' })}
            >
                <span className="icon">🗑️</span> Trash
            </div>

        </nav>
    )
}