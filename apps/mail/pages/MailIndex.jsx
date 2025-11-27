import { mailService } from "../services/mail.service.js"
import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailCompose } from "../cmps/MailCompose.jsx"

const { useState, useEffect } = React
const { Outlet } = ReactRouterDOM

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState({ status: 'inbox', txt: '', isRead: '' })
    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const [stats, setStats] = useState({ unreadCount: 0, draftCount: 0 })

    useEffect(() => {
        loadMails()
        refreshStats()
    }, [filterBy])

    function refreshStats() {
        mailService.getMailCount().then(setStats)
    }

    function loadMails() {
        mailService.query(filterBy)
            .then(setMails)
            .catch(err => console.log('Had issues loading mails', err))
    }

    function onSetFilter(filterByFromChild) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterByFromChild }))
    }


    function onUpdateMail(mailToUpdate) {
        return mailService.save(mailToUpdate)
            .then((savedMail) => {
                if (filterBy.status !== 'inbox' || filterBy.isRead !== '') {
                    loadMails()
                } else {
                    setMails(prevMails => prevMails.map(m => m.id === savedMail.id ? savedMail : m))
                }
                refreshStats()
            })
            .catch(err => console.log('Cannot update mail', err))
    }

    function onSaveMail(mailToSend) {
        mailService.save(mailToSend)
            .then(() => {
                setIsComposeOpen(false)

                if (filterBy.status === 'sent' || filterBy.status === 'draft') {
                    loadMails()
                }
                // UserMsg "Mail Sent"
                refreshStats()
            })
            .catch(err => console.log('Cannot send mail', err))
    }


    if (!mails) return <div>Loading...</div>

    return (
        <section className="mail-index">
            <header className="mail-header">
                <h3>MisterEmail</h3>
                <MailFilter filterBy={filterBy} onSetFilter={onSetFilter} />
            </header>

            <aside className="mail-sidebar">
                <button className="compose-btn" onClick={() => setIsComposeOpen(true)}>Compose</button>
                <MailFolderList
                    filterBy={filterBy}
                    onSetFilter={onSetFilter}
                    unreadCount={stats.unreadCount}
                    draftCount={stats.draftCount}
                />
            </aside>

            <main className="mail-main-content">
                <Outlet context={{ mails, onUpdateMail }} />
            </main>
            {isComposeOpen && <MailCompose onSaveMail={onSaveMail} onClose={() => setIsComposeOpen(false)} />}
        </section>
    )
}