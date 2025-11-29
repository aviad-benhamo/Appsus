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
                <span className="icon"><i className={icon}></i></span>

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
                label="Inbox"
                icon="fa-solid fa-inbox"
                isActive={filterBy.status === 'inbox' && filterBy.isRead === ''}
                onClick={() => onFolderSelect({ status: 'inbox', isRead: '' })}
                count={unreadCount}
            />

            <FolderRow
                label="Unread"
                icon="fa-regular fa-envelope"
                isActive={filterBy.isRead === false}
                onClick={() => onFolderSelect({ status: 'inbox', isRead: false })}
            />

            <FolderRow
                label="Starred"
                icon="fa-regular fa-star"
                isActive={filterBy.status === 'starred'}
                onClick={() => onFolderSelect({ status: 'starred', isRead: '' })}
            />

            <FolderRow
                label="Sent"
                icon="fa-regular fa-paper-plane"
                isActive={filterBy.status === 'sent'}
                onClick={() => onFolderSelect({ status: 'sent', isRead: '' })}
            />

            <FolderRow
                label="Drafts"
                icon="fa-regular fa-file"
                isActive={filterBy.status === 'draft'}
                onClick={() => onFolderSelect({ status: 'draft', isRead: '' })}
                count={draftCount}
            />

            <FolderRow
                label="Trash"
                icon="fa-regular fa-trash-can"
                isActive={filterBy.status === 'trash'}
                onClick={() => onFolderSelect({ status: 'trash', isRead: '' })}
            />

        </nav>
    )
}