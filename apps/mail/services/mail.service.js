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
    getLoggedinUser,
    getMailCount,
}

function query(filterBy = {}) {
    return storageService.query(MAIL_KEY)
        .then(mails => {
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

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt.trim(), 'i')
                mails = mails.filter(mail =>
                    regExp.test(mail.subject) ||
                    regExp.test(mail.body) ||
                    regExp.test(mail.from)
                )
            }

            if (filterBy.isRead !== undefined && filterBy.isRead !== '') {
                mails = mails.filter(mail => mail.isRead === filterBy.isRead)
            }

            if (filterBy.sortBy === 'title') {
                mails.sort((a, b) => a.subject.localeCompare(b.subject))
            } else {
                mails.sort((a, b) => {
                    const dateA = a.sentAt || a.createdAt
                    const dateB = b.sentAt || b.createdAt
                    return dateB - dateA
                })
            }

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

function getMailCount() {
    return storageService.query(MAIL_KEY).then(mails => {
        return mails.reduce((acc, mail) => {
            if (mail.to === loggedinUser.email && !mail.removedAt && mail.sentAt && !mail.isRead) {
                acc.unreadCount++
            }

            if (!mail.sentAt && !mail.removedAt) {
                acc.draftCount++
            }

            return acc
        }, { unreadCount: 0, draftCount: 0 })
    })
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
        // Welcome mail
        mails.push({
            id: utilService.makeId(),
            createdAt: Date.now(),
            sentAt: Date.now(),
            isRead: false,
            isStarred: true,
            subject: 'Welcome to AppsusEmail!',
            body: 'We are thrilled to have you here. This is a demo app built with React.',
            from: 'admin@appsusemail.com',
            to: loggedinUser.email,
            fromAvatar: 'https://cdn-icons-png.flaticon.com/512/3225/3225194.png'
        })

        // Generate 50 realistic emails
        for (let i = 0; i < 50; i++) {
            mails.push(_createRandomMail(i))
        }
        utilService.saveToStorage(MAIL_KEY, mails)
    }
}

function _createRandomMail(i) {
    const isIncoming = Math.random() > 0.2
    const createdAt = Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 30)
    const sentAt = (isIncoming || Math.random() > 0.2) ? createdAt + 10000 : null

    const companies = [
        { name: 'Netflix', domain: 'netflix.com', avatar: 'https://logo.clearbit.com/netflix.com' },
        { name: 'Amazon', domain: 'amazon.com', avatar: 'https://logo.clearbit.com/amazon.com' },
        { name: 'Spotify', domain: 'spotify.com', avatar: 'https://logo.clearbit.com/spotify.com' },
        { name: 'Google', domain: 'google.com', avatar: 'https://logo.clearbit.com/google.com' },
        { name: 'LinkedIn', domain: 'linkedin.com', avatar: 'https://logo.clearbit.com/linkedin.com' },
        { name: 'GitHub', domain: 'github.com', avatar: 'https://logo.clearbit.com/github.com' },
        { name: 'Apple', domain: 'apple.com', avatar: 'https://logo.clearbit.com/apple.com' },
        { name: 'Slack', domain: 'slack.com', avatar: 'https://logo.clearbit.com/slack.com' }
    ]

    const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Rachel', 'James', 'Emily', 'Robert', 'Jessica']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']

    const subjects = [
        'Your subscription is about to expire - Action Required',
        'New login from an unrecognized device in Tel Aviv',
        'Check out this new feature we just released!',
        'Meeting rescheduled: Project Kickoff to Monday at 10 AM',
        'Your Amazon.com order #123-4567890-1234567 has shipped',
        'Weekend plans? Let’s catch up!',
        '30% off on all electronics - Limited time offer',
        'You have a new follower on GitHub',
        'Invoice #4023 for services rendered in October',
        'Security Alert: Please verify your email address immediately',
        'Invitation: Annual Company Party at the Rooftop Bar',
        'Your weekly performance report is ready for view'
    ]

    const bodies = [
        'Hi there,\n\nI hope this email finds you well. I wanted to follow up on our previous conversation regarding the project timeline. We have made significant progress and would love to share the updates with you.\n\nPlease let me know when you are available for a quick sync.\n\nBest regards,',

        'Hello,\n\nWe noticed a new login to your account from an unrecognized device. If this was you, you can safely ignore this email. If not, please change your password immediately to secure your account.\n\nStay safe,',

        'Hey!\n\nAre you free this weekend? We are planning a small get-together at the park. Would love to see you there! Let me know if you can make it.\n\nCheers,',

        'Dear Customer,\n\nYour order has been shipped and is on its way to you. You can track your package using the link below. Thank you for shopping with us!\n\nSupport Team',

        'Greetings,\n\nPlease find the attached invoice for the services provided last month. Let us know if you have any questions or require further clarification.\n\nSincerely,'
    ]

    const isCompany = Math.random() > 0.5

    let senderName, senderEmail, senderAvatar

    if (isIncoming && isCompany) {
        const company = companies[utilService.getRandomIntInclusive(0, companies.length - 1)]
        senderName = company.name
        senderEmail = `noreply@${company.domain}`
        senderAvatar = company.avatar
    } else if (isIncoming) {
        const first = firstNames[utilService.getRandomIntInclusive(0, firstNames.length - 1)]
        const last = lastNames[utilService.getRandomIntInclusive(0, lastNames.length - 1)]
        senderName = `${first} ${last}`
        senderEmail = `${first.toLowerCase()}.${last.toLowerCase()}@gmail.com`
        senderAvatar = `https://i.pravatar.cc/150?u=${senderEmail}`
    } else {
        senderName = loggedinUser.fullname
        senderEmail = loggedinUser.email
        senderAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    }

    const subject = subjects[utilService.getRandomIntInclusive(0, subjects.length - 1)]
    const body = bodies[utilService.getRandomIntInclusive(0, bodies.length - 1)]

    return {
        id: utilService.makeId(),
        createdAt: createdAt,
        sentAt: sentAt,
        removedAt: Math.random() > 0.9 ? Date.now() : null,
        isRead: Math.random() > 0.5,
        isStarred: Math.random() > 0.8,
        subject: subject,
        body: body,
        from: senderEmail,
        fromName: senderName,
        fromAvatar: senderAvatar,
        to: isIncoming ? loggedinUser.email : `recipient@example.com`
    }
}

