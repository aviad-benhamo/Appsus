import { MailPreview } from "./MailPreview.jsx"
const { useOutletContext } = ReactRouterDOM

export function MailList() {
    const { mails, onUpdateMail, onRemoveMail, onEditDraft, filterBy, onSetFilter } = useOutletContext()

    function onSort(sortBy) {
        onSetFilter({ ...filterBy, sortBy })
    }

    if (!mails) return <div>Loading...</div>

    return (
        <section className="mail-list">

            <div className="mail-list-actions">
                <button
                    className={`sort-btn ${filterBy.sortBy === 'date' ? 'active' : ''}`}
                    onClick={() => onSort('date')}
                >
                    Date
                </button>
                <button
                    className={`sort-btn ${filterBy.sortBy === 'title' ? 'active' : ''}`}
                    onClick={() => onSort('title')}
                >
                    Title
                </button>
            </div>


            <ul>
                {mails.map(mail => (
                    <MailPreview
                        key={mail.id}
                        mail={mail}
                        onUpdateMail={onUpdateMail}
                        onRemoveMail={onRemoveMail}
                        onEditDraft={onEditDraft}
                    />
                ))}
            </ul>
        </section>
    )
}
