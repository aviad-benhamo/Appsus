const { useNavigate } = ReactRouterDOM


export function MailFolderList({ filterBy, onSetFilter }) {

    const navigate = useNavigate()

    function onFolderSelect(folderStats) {
        onSetFilter(folderStats)
        navigate('/mail')
    }

    return (
        <nav className="mail-folder-list">

            <div
                className={`folder-link ${filterBy.status === 'inbox' && filterBy.isRead === '' ? 'active' : ''}`}
                onClick={() => onFolderSelect({ status: 'inbox', isRead: '' })}
            >
                <span className="icon">📥</span> Inbox
            </div>

            <div
                className={`folder-link ${filterBy.isRead === false ? 'active' : ''}`}
                onClick={() => onFolderSelect({ status: 'inbox', isRead: false })}
            >
                <span className="icon">✉️</span> Unread
            </div>

            <div
                className={`folder-link ${filterBy.status === 'starred' ? 'active' : ''}`}
                onClick={() => onFolderSelect({ status: 'starred', isRead: '' })}
            >
                <span className="icon">⭐️</span> Starred
            </div>

            <div
                className={`folder-link ${filterBy.status === 'sent' ? 'active' : ''}`}
                onClick={() => onFolderSelect({ status: 'sent', isRead: '' })}
            >
                <span className="icon">📤</span> Sent
            </div>

            <div
                className={`folder-link ${filterBy.status === 'draft' ? 'active' : ''}`}
                onClick={() => onFolderSelect({ status: 'draft', isRead: '' })}
            >
                <span className="icon">📄</span> Drafts
            </div>

            <div
                className={`folder-link ${filterBy.status === 'trash' ? 'active' : ''}`}
                onClick={() => onFolderSelect({ status: 'trash', isRead: '' })}
            >
                <span className="icon">🗑️</span> Trash
            </div>

        </nav>
    )
}