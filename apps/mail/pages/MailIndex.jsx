import { mailService } from "../services/mail.service.js"
import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailFolderList } from "../cmps/MailFolderList.jsx"

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
        return mailService.save(mailToUpdate)
            .then((savedMail) => {
                if (filterBy.status !== 'inbox' || filterBy.isRead !== '') {
                    loadMails()
                } else {
                    setMails(prevMails => prevMails.map(m => m.id === savedMail.id ? savedMail : m))
                }
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
                <MailFolderList
                    filterBy={filterBy}
                    onSetFilter={onSetFilter}
                />
            </aside>

            <main className="mail-main-content">
                <Outlet context={{ mails, onUpdateMail }} />
            </main>
        </section>
    )
}