import { mailService } from "../services/mail.service.js"
import { MailFilter } from "../cmps/MailFilter.jsx"

const { useState, useEffect } = React
const { Outlet } = ReactRouterDOM

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

    function onUpdateMail(mailToUpdate) {
        mailService.save(mailToUpdate)
            .then((savedMail) => {
                setMails(prevMails => prevMails.map(mail => mail.id === savedMail.id ? savedMail : mail))
            })
            .catch(err => console.log('Cannot update mail', err))
    }


    if (!mails) return <div>Loading...</div>

    return (
        <section className="mail-index">
            <header className="mail-header">
                <h3>MisterEmail</h3>
                <MailFilter filterBy={filterBy} onSetFilter={onSetFilter} />
            </header>

            <aside className="mail-sidebar">
                <button className="compose-btn">Compose</button>
                <nav>
                    <div className="folder-link active">Inbox</div>
                    <div className="folder-link">Starred</div>
                    <div className="folder-link">Sent</div>
                    <div className="folder-link">Drafts</div>
                    <div className="folder-link">Trash</div>
                </nav>
            </aside>

            <main className="mail-main-content">
                <Outlet context={{ mails, onUpdateMail }} />
            </main>
        </section>
    )
}