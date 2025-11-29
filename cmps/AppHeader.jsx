const { useState } = React
const { useNavigate } = ReactRouterDOM

export function AppHeader() {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    function onToggleMenu() {
        setIsOpen(!isOpen)
    }

    function onNavigate(path) {
        setIsOpen(false)
        navigate(path)
    }

    return (
        <header className="app-header">
            <button className="apps-btn" onClick={onToggleMenu} title="Appsus Apps">
                <i className="fa-solid fa-grip"></i>
            </button>

            {isOpen && (
                <div className="apps-dropdown">
                    <div className="app-item" onClick={() => onNavigate('/')}>
                        <span className="icon 🏠">
                            <i className="fa-solid fa-house"></i>
                        </span>
                        <span>Home</span>
                    </div>

                    <div className="app-item" onClick={() => onNavigate('/about')}>
                        <span className="icon ℹ️">
                            <i className="fa-solid fa-info"></i>
                        </span>
                        <span>About</span>
                    </div>

                    <div className="app-item" onClick={() => onNavigate('/mail')}>
                        <span className="icon ✉️">
                            <i className="fa-solid fa-envelope"></i>
                        </span>
                        <span>Mail</span>
                    </div>
                    <div
                        className="app-item disabled"
                        title="Coming soon!"
                        onClick={(e) => e.preventDefault()}
                    >
                        <span className="icon" style={{ color: '#fbbc04' }}>
                            <i className="fa-solid fa-note-sticky"></i>
                        </span>
                        <span>Keep</span>
                    </div>
                </div>

            )}

            {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)}></div>}
        </header>
    )
}