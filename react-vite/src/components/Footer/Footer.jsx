import './Footer.css';
import { GrLinkedin } from "react-icons/gr";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="footer">
                <div className='footer-author-name'>&copy; 2024 <strong>HUI WEN</strong>. All rights reserved.</div>
                <div>
                    <a href="https://github.com/Sally-HuiWen/solo-capstone" target="_blank" rel="noopener noreferrer">
                      <FaGithub className='footer-github-icon'/> GitHub
                    </a> 
                    <a href="https://www.linkedin.com/in/hui-wen-best/" target="_blank" rel="noopener noreferrer">
                      <GrLinkedin className='footer-linkedin-icon'/> LinkedIn
                    </a>
                </div>
        </footer>
    );
}