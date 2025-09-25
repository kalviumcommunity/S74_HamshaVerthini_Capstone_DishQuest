import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Header.css'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>DISHQUEST</h1>
            </Link>
          </div>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/browse">Browse Recipes</Link>
            <Link to="/add-recipe">Add Recipe</Link>
          </nav>
          <div className="header-actions">
            <form className="search-bar" onSubmit={handleSearch}>
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search recipes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="icons">
              <span className="icon">🔔</span>
              <span className="icon">👤</span>
            </div>
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">LOGIN</Link>
              <Link to="/signup" className="btn btn-primary">SIGNUP</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
