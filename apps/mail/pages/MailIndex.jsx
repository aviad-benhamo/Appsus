import { mailService } from "../services/mail.service.js"
import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailCompose } from "../cmps/MailCompose.jsx"
import { UserMsg } from "../cmps/UserMsg.jsx"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { Outlet } = ReactRouterDOM

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState({ status: 'inbox', txt: '', isRead: '', sortBy: 'date' })
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
    const [stats, setStats] = useState({ unreadCount: 0, draftCount: 0 })
    const [composeMail, setComposeMail] = useState(null)

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
            .catch(err => {
                console.log('Cannot update mail', err)
                showErrorMsg('Cannot update mail')
            })
    }

    function onRemoveMail(mailId) {
        return mailService.remove(mailId)
            .then(() => {
                setMails(prevMails => prevMails.filter(m => m.id !== mailId))
                refreshStats()
                showSuccessMsg('Conversation moved to Trash')
            })
            .catch(err => {
                showErrorMsg('Failed to move conversation to Trash')
                console.log('Cannot remove mail', err)
            })
    }

    function onSaveMail(mailToSend, isAutoSave = false) {
        return mailService.save(mailToSend)
            .then((savedMail) => {
                if (!isAutoSave) {
                    setComposeMail(null)
                    if (savedMail.sentAt) {
                        showSuccessMsg('Message sent')
                    } else {
                        showSuccessMsg('Draft saved')
                    }
                }

                if (filterBy.status === 'sent' || filterBy.status === 'draft') {
                    loadMails()
                }
                refreshStats()

                return savedMail
            })
            .catch(err => {
                console.log('Cannot save mail', err)
                if (!isAutoSave) showErrorMsg('Cannot save mail')
            })
    }

    function onEditDraft(draft) {
        setComposeMail(draft)
    }

    if (!mails) return <div>Loading...</div>

    return (
        <section className={`mail-index ${isSidebarExpanded ? '' : 'collapsed'}`}>
            <header className="mail-header">
                <div className="header-start">
                    <button
                        className="menu-toggle-btn"
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                    >
                        ☰
                    </button>
                    <h3>MisterEmail</h3>
                </div>
                <MailFilter filterBy={filterBy} onSetFilter={onSetFilter} />
            </header>

            <aside className="mail-sidebar">
                <button
                    className={`compose-btn ${isSidebarExpanded ? '' : 'small'}`}
                    onClick={() => setComposeMail(mailService.getEmptyMail())}
                >
                    <span className="icon">✏️</span>
                    {isSidebarExpanded && <span className="txt">Compose</span>}
                </button>

                <MailFolderList
                    filterBy={filterBy}
                    onSetFilter={onSetFilter}
                    unreadCount={stats.unreadCount}
                    draftCount={stats.draftCount}
                    isExpanded={isSidebarExpanded}
                />
            </aside>

            <main className="mail-main-content">
                <Outlet context={{
                    mails,
                    onUpdateMail,
                    onRemoveMail,
                    onEditDraft,
                    filterBy,
                    onSetFilter
                }} />
            </main>
            {composeMail && (
                <MailCompose
                    initialMail={composeMail}
                    onSaveMail={onSaveMail}
                    onClose={() => setComposeMail(null)}
                />
            )}
            <UserMsg />
        </section>
    )
}