import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React

export function MailCompose({ onSaveMail, onClose }) {

    const [newMail, setNewMail] = useState(mailService.getEmptyMail())
    const draftRef = useRef(newMail)

    useEffect(() => {
        draftRef.current = newMail
    }, [newMail])


    useEffect(() => {
        const intervalId = setInterval(() => {
            const currDraft = draftRef.current

            // שומרים רק אם יש תוכן כלשהו ועדיין לא נשלח
            if (currDraft.to || currDraft.subject || currDraft.body) {
                // console.log('Auto saving draft...')

                const draftToSave = {
                    ...currDraft,
                    createdAt: currDraft.createdAt || Date.now()
                }

                // שולחים true כדי לסמן שזו שמירה אוטומטית (לא לסגור חלון)
                onSaveMail(draftToSave, true)
                    .then(savedDraft => {
                        // אם לטיוטה לא היה ID (פעם ראשונה), מעדכנים אותו כעת
                        // כדי שהשמירה הבאה תעדכן את אותו מסמך ולא תיצור חדש
                        if (!currDraft.id) {
                            setNewMail(prev => ({ ...prev, id: savedDraft.id }))
                        }
                    })
            }
        }, 5000)

        return () => clearInterval(intervalId)
    }, [])

    function handleChange({ target }) {
        const field = target.name
        const value = target.value
        setNewMail(prev => ({ ...prev, [field]: value }))
    }

    function onSend(ev) {
        ev.preventDefault()
        const mailToSend = {
            ...newMail,
            createdAt: newMail.createdAt || Date.now(),
            sentAt: Date.now(),
            isRead: true,
        }
        onSaveMail(mailToSend)
    }

    function onCloseModal() {
        if (newMail.to || newMail.subject || newMail.body) {
            const draftToSave = {
                ...newMail,
                createdAt: newMail.createdAt || Date.now(),
            }
            onSaveMail(draftToSave)
        } else {
            onClose()
        }
    }

    return (
        <section className="mail-compose">
            <header className="compose-header">
                <h4>New Message</h4>
                <button onClick={onCloseModal} className="close-btn">✕</button>
            </header>

            <form onSubmit={onSend} className="compose-form">
                <input
                    type="email"
                    name="to"
                    value={newMail.to}
                    onChange={handleChange}
                    placeholder="To"
                    required
                    autoFocus
                />

                <input
                    type="text"
                    name="subject"
                    value={newMail.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                />

                <textarea
                    name="body"
                    value={newMail.body}
                    onChange={handleChange}
                    className="compose-body"
                >
                </textarea>

                <div className="compose-actions">
                    <button className="send-btn">Send</button>
                </div>
            </form>
        </section>
    )
}