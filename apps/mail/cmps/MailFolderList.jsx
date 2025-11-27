const { useNavigate } = ReactRouterDOM


export function MailFolderList({ filterBy, onSetFilter, unreadCount, draftCount, isExpanded }) {

    const navigate = useNavigate()

    function onFolderSelect(folderStats) {
        onSetFilter(folderStats)
        navigate('/mail')
    }

    function FolderRow({ label, icon, isActive, onClick, count }) {
        return (
            <div
                className={`folder-link ${isActive ? 'active' : ''} ${!isExpanded ? 'collapsed' : ''}`}
                onClick={onClick}
                title={label}
            >
                <span className="icon">{icon}</span>

                {isExpanded && (
                    <React.Fragment>
                        <span className="label">{label}</span>
                        {count > 0 && <span className="badge">{count}</span>}
                    </React.Fragment>
                )}
            </div>
        )
    }


    return (
        <nav className="mail-folder-list">

            <FolderRow
                label="Inbox" icon="📥"
                isActive={filterBy.status === 'inbox' && filterBy.isRead === ''}
                onClick={() => onFolderSelect({ status: 'inbox', isRead: '' })}
                count={unreadCount}
            />

            <FolderRow
                label="Unread" icon="✉️"
                isActive={filterBy.isRead === false}
                onClick={() => onFolderSelect({ status: 'inbox', isRead: false })}
            />

            <FolderRow
                label="Starred" icon="⭐️"
                isActive={filterBy.status === 'starred'}
                onClick={() => onFolderSelect({ status: 'starred', isRead: '' })}
            />

            <FolderRow
                label="Sent" icon="📤"
                isActive={filterBy.status === 'sent'}
                onClick={() => onFolderSelect({ status: 'sent', isRead: '' })}
            />

            <FolderRow
                label="Drafts" icon="📄"
                isActive={filterBy.status === 'draft'}
                onClick={() => onFolderSelect({ status: 'draft', isRead: '' })}
                count={draftCount}
            />

            <FolderRow
                label="Trash" icon="🗑️"
                isActive={filterBy.status === 'trash'}
                onClick={() => onFolderSelect({ status: 'trash', isRead: '' })}
            />

        </nav>
    )
}