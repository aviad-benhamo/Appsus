const { Link } = ReactRouterDOM

export function Home() {
    return (
        <section className="home-page">
            <div className="hero">
                <img src="assets/img/AppsusLogo.jpg" alt="Appsus Logo" className="hero-logo" />
                <h1>Welcome to Appsus</h1>
                <p>One place for all your productivity needs</p>
            </div>

            <div className="apps-grid">
                <Link to="/mail" className="app-card mail">
                    <div className="icon-container">
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    <h3>Email</h3>
                    <p>Connect, share, and get things done.</p>
                </Link>

                <Link to="/about" className="app-card about">
                    <div className="icon-container">
                        <i className="fa-solid fa-info"></i>
                    </div>
                    <h3>About Us</h3>
                    <p>Learn more about our mission and team.</p>
                </Link>
            </div>
        </section>
    )
}