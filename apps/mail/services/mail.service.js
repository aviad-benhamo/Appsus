import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const MAIL_KEY = 'mailDB'
const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

_createMails()

export const mailService = {
    query,
    get,
    remove,
    save,
    getEmptyMail,
    getFilterFromSearchParams,
    getLoggedinUser
}

function query(filterBy = {}) {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            // 1. Filter by Status (Folder)
            if (filterBy.status) {
                if (filterBy.status === 'inbox') {
                    mails = mails.filter(mail => mail.to === loggedinUser.email && !mail.removedAt && mail.sentAt)
                } else if (filterBy.status === 'sent') {
                    mails = mails.filter(mail => mail.from === loggedinUser.email && !mail.removedAt && mail.sentAt)
                } else if (filterBy.status === 'trash') {
                    mails = mails.filter(mail => mail.removedAt)
                } else if (filterBy.status === 'draft') {
                    mails = mails.filter(mail => !mail.sentAt && !mail.removedAt)
                } else if (filterBy.status === 'starred') {
                    mails = mails.filter(mail => mail.isStarred && !mail.removedAt)
                }
            }

            // 2. Filter by Search Text (Subject or Body)
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt.trim(), 'i')
                mails = mails.filter(mail =>
                    regExp.test(mail.subject) ||
                    regExp.test(mail.body) ||
                    regExp.test(mail.from))
            }

            // 3. Filter by Read/Unread
            if (filterBy.isRead !== undefined && filterBy.isRead !== null && filterBy.isRead !== '') {
                const isReadBool = (String(filterBy.isRead) === 'true')
                mails = mails.filter(mail => mail.isRead === isReadBool)
            }

            // 4. Sort (Default by Date Descending)
            mails.sort((a, b) => (b.createdAt - a.createdAt))

            return mails
        })
}

function get(mailId) {
    return storageService.get(MAIL_KEY, mailId)
}

function remove(mailId) {
    // If in trash -> remove permanently. If not -> move to trash.
    return get(mailId).then(mail => {
        if (mail.removedAt) {
            return storageService.remove(MAIL_KEY, mailId)
        } else {
            mail.removedAt = Date.now()
            return storageService.put(MAIL_KEY, mail)
        }
    })
}

function save(mail) {
    if (mail.id) {
        return storageService.put(MAIL_KEY, mail)
    } else {
        mail.createdAt = Date.now()
        // If it's a draft being sent, sentAt will be updated by the controller/component before calling save
        return storageService.post(MAIL_KEY, mail)
    }
}

function getEmptyMail() {
    return {
        subject: '',
        body: '',
        isRead: false,
        isStarred: false,
        sentAt: null,
        removedAt: null,
        from: loggedinUser.email,
        to: '',
        createdAt: null
    }
}

function getLoggedinUser() {
    return { ...loggedinUser }
}

function getFilterFromSearchParams(searchParams) {
    return {
        status: searchParams.get('status') || 'inbox',
        txt: searchParams.get('txt') || '',
        isRead: searchParams.get('isRead') || ''
    }
}

function _createMails() {
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {
        mails = []
        for (let i = 0; i < 20; i++) {
            mails.push(_createMail(i))
        }
        utilService.saveToStorage(MAIL_KEY, mails)
    }
}

function _createMail(i) {
    const isIncoming = Math.random() > 0.3
    return {
        id: utilService.makeId(),
        createdAt: Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 30), // up to 1 month ago
        subject: utilService.makeLorem(3),
        body: utilService.makeLorem(20),
        isRead: Math.random() > 0.7,
        isStarred: Math.random() > 0.8,
        sentAt: Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 7),
        removedAt: Math.random() > 0.9 ? Date.now() : null, // 10% chance to be in trash
        from: isIncoming ? `${utilService.makeLorem(1)}@momo.com` : loggedinUser.email,
        to: isIncoming ? loggedinUser.email : `${utilService.makeLorem(1)}@momo.com`
    }
}