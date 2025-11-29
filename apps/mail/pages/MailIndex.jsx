import { mailService } from "../services/mail.service.js"
import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailCompose } from "../cmps/MailCompose.jsx"
import { UserMsg } from "../cmps/UserMsg.jsx"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { useIsMobile } from "../../../services/hooks.service.js"

const { useState, useEffect } = React
const { Outlet } = ReactRouterDOM

export function MailIndex() {
    const isMobile = useIsMobile()

    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState({ status: 'inbox', txt: '', isRead: '', sortBy: 'date' })
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(!window.matchMedia('(max-width: 768px)').matches)
    const [stats, setStats] = useState({ unreadCount: 0, draftCount: 0 })
    const [composeMail, setComposeMail] = useState(null)

    useEffect(() => {
        loadMails()
        refreshStats()
    }, [filterBy])

    // Close sidebar on mobile when screen resizes
    useEffect(() => {
        if (isMobile) {
            setIsSidebarExpanded(false)
        }
    }, [isMobile])

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

    function closeSidebarOnMobile() {
        if (isMobile) {
            setIsSidebarExpanded(false)
        }
    }

    return (
        <section className={`mail-index ${isSidebarExpanded ? '' : 'collapsed'}`}>
            {/* Mobile overlay to close sidebar */}
            {isMobile && isSidebarExpanded && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarExpanded(false)}
                />
            )}
            <header className="mail-header">
                <div className="header-start">
                    <button
                        className="menu-toggle-btn"
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <div className="logo-brand">
                        <i className="fa-solid fa-envelope fa-lg" style={{ color: '#0b57d0' }}></i>
                        <h3>Appsus Mail</h3>
                    </div>
                </div>
                <MailFilter filterBy={filterBy} onSetFilter={onSetFilter} />
            </header>

            <aside className="mail-sidebar">
                <button
                    className={`compose-btn ${isSidebarExpanded ? '' : 'small'}`}
                    onClick={() => setComposeMail(mailService.getEmptyMail())}
                >
                    <span className="icon"><i className="fa-solid fa-pencil"></i></span>
                    {isSidebarExpanded && <span className="txt">Compose</span>}
                </button>

                <MailFolderList
                    filterBy={filterBy}
                    onSetFilter={onSetFilter}
                    unreadCount={stats.unreadCount}
                    draftCount={stats.draftCount}
                    isExpanded={isSidebarExpanded}
                    onFolderClick={closeSidebarOnMobile}
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