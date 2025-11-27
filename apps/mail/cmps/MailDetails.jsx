import { mailService } from "../services/mail.service.js"

const { useEffect, useState } = React
const { useParams, useNavigate, useOutletContext } = ReactRouterDOM

export function MailDetails({ mails }) {
    const [mail, setMail] = useState(null)
    const { mailId } = useParams()
    const navigate = useNavigate()
    const { onUpdateMail } = useOutletContext()

    useEffect(() => {
        loadMail()
    }, [mailId])

    function loadMail() {
        mailService.get(mailId)
            .then(mail => setMail(mail))
            .catch(err => {
                console.log('Problem getting mail', err)
                navigate('/mail')
            })
    }

    function onRemoveMail() {
        mailService.remove(mail.id)
            .then(() => {
                navigate('/mail')
            })
            .catch(err => console.log('Problems removing mail', err))
    }

    function onToggleReadStatus() {
        const mailToUpdate = { ...mail, isRead: !mail.isRead }
        onUpdateMail(mailToUpdate)
        navigate('/mail')
    }


    if (!mail) return <div>Loading...</div>


    return (
        <section className="mail-details">
            <div className="toolbar">
                <button onClick={() => navigate('/mail')}>← Back</button>
                <button onClick={onToggleReadStatus}>
                    Mark as Unread
                </button>
                <button onClick={onRemoveMail}>Delete</button>
            </div>

            <h2>{mail.subject}</h2>
            <div className="mail-header-details">
                <h4>From: {mail.from}</h4>
                <span>{new Date(mail.createdAt).toLocaleString()}</span>
            </div>
            <pre className="mail-body">{mail.body}</pre>
        </section>
    )
}