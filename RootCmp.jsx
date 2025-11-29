const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from "./cmps/AppHeader.jsx"
import { About } from "./pages/About.jsx"
import { Home } from "./pages/Home.jsx"
import { MailIndex } from "./apps/mail/pages/MailIndex.jsx"
import { MailList } from "./apps/mail/cmps/MailList.jsx"
import { MailDetails } from "./apps/mail/cmps/MailDetails.jsx"

export function App() {
    return <Router>
        <section className="app">
            <AppHeader />

            <main className="main-app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />

                    <Route path="/mail" element={<MailIndex />}>
                        <Route index element={<MailList />} />
                        <Route path=":folder" element={<MailList />} />
                        <Route path="details/:mailId" element={<MailDetails />} />
                    </Route>
                </Routes>
            </main>
        </section>
    </Router>
}