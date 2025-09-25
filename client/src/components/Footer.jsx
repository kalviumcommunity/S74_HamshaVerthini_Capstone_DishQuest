import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>DISHQUEST</h3>
            <p>Discover, share, and celebrate the joy of cooking with our global culinary community.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/browse">Browse Recipes</Link></li>
              <li><Link to="/add-recipe">Add Recipe</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li><a href="#italian">Italian</a></li>
              <li><a href="#mexican">Mexican</a></li>
              <li><a href="#asian">Asian</a></li>
              <li><a href="#vegetarian">Vegetarian</a></li>
              <li><a href="#desserts">Desserts</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Join Our Newsletter</h4>
            <p>Get the latest recipes and cooking tips straight to your inbox!</p>
            <div className="newsletter">
              <input type="email" placeholder="Your email address" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
