import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Header.css'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1 className="logo-text">
              <span className="dish">DISH</span>
              <span className="quest">QUEST</span>
            </h1>
          </Link>
        </div>

        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/browse" className={location.pathname === '/browse' ? 'active' : ''}>Browse Recipes</Link>
          <Link to="/add-recipe" className={location.pathname === '/add-recipe' ? 'active' : ''}>Add Recipe</Link>
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

          {user ? (
            <div className="user-profile-menu">
              <Link to="/profile" className="profile-btn" title="View Profile">
                <img 
                  src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"} 
                  alt="Profile" 
                  className="header-avatar"
                />
                <span className="user-name">{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">LOGIN</Link>
              <Link to="/signup" className="btn btn-primary">SIGNUP</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
