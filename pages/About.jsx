
export function About() {
    return (
        <section className="about-page">
            <div className="about-container">

                <div className="profile-card">
                    <div className="img-container">
                        <img
                            src="assets/img/my-photo.jpeg"
                            alt="Aviad Ben Hamo"
                            onError={(e) => e.target.src = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'}
                        />
                    </div>

                    <div className="profile-info">
                        <h2>Aviad Ben Hamo</h2>
                        <p className="title">Full Stack Developer</p>

                        <div className="social-links">
                            <a href="https://www.linkedin.com/in/aviad-ben-hamo-176a18122/" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-linkedin"></i>
                            </a>
                            <a href="https://github.com/aviad-benhamo/" title="GitHub" target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-github"></i>
                            </a>
                            <a href="mailto:aviad.benhamo@gmail.com" title="Email">
                                <i className="fa-solid fa-envelope"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <h1>About Appsus</h1>
                    <h3>Reimagining Productivity.</h3>

                    <p>
                        Appsus was born out of a passion for creating beautiful things that work seamlessly.
                        The goal wasn't just to build another email app, but to create a user experience (UX) that feels natural, fast, and enjoyable.
                    </p>
                    <p>
                        In this project, I emphasized clean architecture, proper use of React Hooks, and a Pixel Perfect design that adapts to any screen.
                        This is where technology meets simplicity.
                    </p>

                    <div className="tech-stack">
                        <span title="Modern styling features">CSS3</span>
                        <span title="Single Page Application - Fast & Responsive">SPA</span>
                        <span>React</span>
                        <span>Hooks</span>
                        <span>React Router</span>
                    </div>
                </div>

            </div>
        </section>
    )
}
