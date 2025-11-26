import { mailService } from "../services/mail.service.js"
import { MailFilter } from "../cmps/MailFilter.jsx"

const { useState, useEffect } = React

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState({ status: 'inbox', txt: '', isRead: '' })

    useEffect(() => {
        loadMails()
    }, [filterBy])

    function loadMails() {
        mailService.query(filterBy)
            .then(setMails)
            .catch(err => console.log('Had issues loading mails', err))
    }

    function onSetFilter(filterByFromChild) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterByFromChild }))
    }

    if (!mails) return <div>Loading...</div>

    return (
        <section className="mail-index">
            <header className="mail-header">
                <h3>MisterEmail</h3>
                <MailFilter filterBy={filterBy} onSetFilter={onSetFilter} />
            </header>

            <aside className="mail-sidebar">
                <button className="compose-btn">✏️ Compose</button>
                <nav>
                    <div className="folder-link active">📥 Inbox</div>
                    <div className="folder-link">⭐️ Starred</div>
                    <div className="folder-link">📤 Sent</div>
                    <div className="folder-link">📄 Drafts</div>
                    <div className="folder-link">🗑️ Trash</div>
                </nav>
            </aside>

            <main className="mail-main-content">
                <ul>
                    {mails.map(mail => (
                        <li key={mail.id} className="mail-preview-row">
                            <span className="star">{mail.isStarred ? '★' : '☆'}</span>
                            <span className="from">{mail.from}</span>
                            <span className="subject">{mail.subject}</span>
                            <span className="date">{new Date(mail.createdAt).toLocaleDateString()}</span>
                        </li>
                    ))}
                </ul>
            </main>
        </section>
    )
}