import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Home.css'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const featuredRecipes = [
    {
      id: 1,
      title: "Mexican Street Corn Tacos",
      author: "Sofia Rodriguez",
      time: "20 min",
      difficulty: "Easy",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Creamy Tuscan Garlic Chicken",
      author: "Maria Johnson",
      time: "30 min",
      difficulty: "Medium",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Spicy Thai Basil Noodles",
      author: "Alex Chan",
      time: "25 min",
      difficulty: "Easy",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop"
    }
  ]

  const categories = [
    {
      name: "Italian",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop"
    },
    {
      name: "Desserts",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
    },
    {
      name: "Vegetarian",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop"
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
          <div className="recipe-grid">
            {featuredRecipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-image">
                  <img src={recipe.image} alt={recipe.title} />
                </div>
                <div className="recipe-content">
                  <h3>{recipe.title}</h3>
                  <div className="recipe-meta">
                    <span className="author">By {recipe.author}</span>
                    <span className="time">{recipe.time}</span>
                    <span className="difficulty">{recipe.difficulty}</span>
                  </div>
                  <div className="rating">
                    <span className="stars">⭐</span>
                    <span>{recipe.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              <div key={category.name} className="category-card">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <h3>{category.name}</h3>
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
