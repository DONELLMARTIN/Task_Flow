import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


function Home() {




    return (
        <div>

            <nav className="navbar">
                <h1 className="logo">TaskFlow</h1>
            </nav>

            <div className="hero">
                <div className="hero-content">

                    <h1>Stay Organized. Stay Ahead.</h1>
                    <p>
                        TaskFlow helps students manage assignments, deadlines,
                        and study goals in one simple place.
                        No more forgotten homework. No more chaos.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/register">
                            <button>Get Started</button>
                        </Link>


                        <Link to="/login">
                            <button className="secondary">Login</button></Link>
                    </div>

                </div>
            </div>

            <section className="about">
                <h2>What is TaskFlow?</h2>

                <p>
                    TaskFlow is a smart task manager built for students who want
                    to stay focused and organized.
                    Create tasks, set deadlines, track progress and keep your
                    academic life under control.
                </p>
                <p>
                    Whether you're preparing for exams, managing assignments,
                    or planning study sessions, TaskFlow keeps everything
                    simple, clean, and efficient.
                </p>
            </section>
        </div>
    );
}

export default Home;
