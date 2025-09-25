import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './BrowseRecipes.css'

const BrowseRecipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    category: '',
    cuisine: '',
    difficulty: '',
    search: searchParams.get('search') || ''
  })

  useEffect(() => {
    fetchRecipes()
  }, [currentPage, filters])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 6,
        ...filters
      })
      
      const response = await axios.get(`http://localhost:5000/api/recipes?${params}`)
      setRecipes(response.data.recipes || [])
      setTotalPages(response.data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      // Fallback to mock data if API fails
      setRecipes(getMockRecipes())
      setTotalPages(2)
    } finally {
      setLoading(false)
    }
  }

  const getMockRecipes = () => [
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
    },
    {
      id: 4,
      title: "Italian Margherita Pizza",
      author: "Marco Rossi",
      time: "45 min",
      difficulty: "Medium",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Chocolate Lava Cake",
      author: "Emma Wilson",
      time: "35 min",
      difficulty: "Hard",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      title: "Vegetarian Buddha Bowl",
      author: "Sarah Green",
      time: "15 min",
      difficulty: "Easy",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
    }
  ]

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="browse-recipes">
      <Header />
      
      <div className="browse-content">
        <div className="container">
          <div className="page-header">
            <h1>Browse Recipes</h1>
            <p>Discover amazing recipes from our community</p>
          </div>

          <div className="browse-layout">
            {/* Filters Sidebar */}
            <div className="filters-sidebar">
              <h3>Filters</h3>
              
              <div className="filter-group">
                <label>Category</label>
                <select 
                  value={filters.category} 
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="dessert">Dessert</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Cuisine</label>
                <select 
                  value={filters.cuisine} 
                  onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                >
                  <option value="">All Cuisines</option>
                  <option value="italian">Italian</option>
                  <option value="mexican">Mexican</option>
                  <option value="asian">Asian</option>
                  <option value="american">American</option>
                  <option value="indian">Indian</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Difficulty</label>
                <select 
                  value={filters.difficulty} 
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="recipes-content">
              {loading ? (
                <div className="loading">Loading recipes...</div>
              ) : (
                <>
                  <div className="recipe-grid">
                    {recipes.map(recipe => (
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-outline"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`btn ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-outline"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BrowseRecipes
