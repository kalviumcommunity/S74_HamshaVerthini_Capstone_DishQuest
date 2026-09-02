import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Home.css'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredRecipes, setFeaturedRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchFeaturedRecipes()
  }, [])

  const fetchFeaturedRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recipes?featured=true')
      if (response.data && response.data.recipes) {
        setFeaturedRecipes(response.data.recipes)
      }
    } catch (err) {
      console.error('Error fetching featured recipes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const categories = [
    {
      name: "Italian",
      key: "italian",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=500&fit=crop"
    },
    {
      name: "Desserts",
      key: "dessert",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop"
    },
    {
      name: "Vegetarian",
      key: "lunch",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop"
    },
    {
      name: "Mexican",
      key: "mexican",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=500&fit=crop"
    }
  ]

  return (
    <div className="home">
      <Header />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover & Share <span className="highlight">Delicious</span> Recipes
            </h1>
            <p className="hero-description">
              Join our culinary community to find inspiration, share your favorite dishes, 
              and connect with food lovers from around the world.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/browse')}
              >
                Browse Recipes
              </button>
              <button 
                className="btn btn-outline btn-large"
                onClick={() => navigate('/add-recipe')}
              >
                Add Your Recipe
              </button>
            </div>
            <div className="hero-search">
              <form className="search-bar large" onSubmit={handleSearch}>
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search for recipes, ingredients, cuisine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">Search</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="featured-recipes">
        <div className="container">
          <div className="section-header">
            <h2>Featured Recipes</h2>
            <p>Discover our community's most loved dishes</p>
          </div>

          {loading ? (
            <div className="loading-spinner">🍳 Loading featured recipes...</div>
          ) : (
            <div className="recipe-grid">
              {featuredRecipes.map(recipe => (
                <div 
                  key={recipe._id} 
                  className="recipe-card clickable"
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                >
                  <div className="recipe-image">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop"
                      }}
                    />
                    <span className="recipe-category-tag">{recipe.category}</span>
                  </div>
                  <div className="recipe-content">
                    <h3>{recipe.title}</h3>
                    <p className="recipe-desc">{recipe.description}</p>
                    <div className="recipe-meta">
                      <span className="author">By {recipe.authorName || 'Chef'}</span>
                      <span className="time">⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                      <span className="difficulty">💪 {recipe.difficulty}</span>
                    </div>
                    <div className="rating-row">
                      <div className="rating">
                        <span className="stars">⭐</span>
                        <span>{recipe.rating ? recipe.rating.toFixed(1) : "5.0"}</span>
                        <span className="reviews-count">({recipe.numReviews || 1})</span>
                      </div>
                      <span className="view-link">View Recipe →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="section-footer">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/browse')}
            >
              View All Recipes
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Explore by Category</h2>
            <p>Find recipes that match your tastes and dietary preferences</p>
          </div>
          <div className="category-grid">
            {categories.map(category => (
              <div 
                key={category.name} 
                className="category-card clickable"
                onClick={() => navigate(`/browse?category=${category.key}`)}
              >
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <h3>{category.name}</h3>
                  <span>Explore Recipes →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to share your culinary masterpiece?</h2>
            <p>Join thousands of home cooks and food enthusiasts who are sharing their favorite recipes with our community.</p>
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/add-recipe')}
            >
              Add Your Recipe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
