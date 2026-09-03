import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './BrowseRecipes.css'

const API_URL =
  'https://s74-hamshaverthini-capstone-dishquest-10.onrender.com'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop'

const BrowseRecipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedRecipeIds, setSavedRecipeIds] = useState([])

  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    cuisine: searchParams.get('cuisine') || '',
    difficulty: searchParams.get('difficulty') || '',
    search: searchParams.get('search') || ''
  })

  // Sync filters with URL
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      cuisine: searchParams.get('cuisine') || '',
      difficulty: searchParams.get('difficulty') || '',
      search: searchParams.get('search') || ''
    })
  }, [searchParams])

  // Fetch recipes whenever filters change
  useEffect(() => {
    fetchRecipes()
  }, [filters])

  // Fetch saved recipes once when page loads
  useEffect(() => {
    fetchUserProfile()
  }, [])

  // ----------------------------------------
  // FETCH USER PROFILE
  // ----------------------------------------
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      return
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data && response.data.user) {
        const savedRecipes = response.data.user.savedRecipes || []

        const savedIds = savedRecipes.map(recipe =>
          typeof recipe === 'object'
            ? recipe._id
            : recipe
        )

        setSavedRecipeIds(savedIds)
      }
    } catch (error) {
      console.error(
        'Error fetching user profile saved recipes:',
        error
      )
    }
  }

  // ----------------------------------------
  // FETCH RECIPES
  // ----------------------------------------
  const fetchRecipes = async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (filters.category) {
        params.append('category', filters.category)
      }

      if (filters.cuisine) {
        params.append('cuisine', filters.cuisine)
      }

      if (filters.difficulty) {
        params.append('difficulty', filters.difficulty)
      }

      if (filters.search) {
        params.append('search', filters.search)
      }

      const queryString = params.toString()

      const url = queryString
        ? `${API_URL}/api/recipes?${queryString}`
        : `${API_URL}/api/recipes`

      const response = await axios.get(url)

      if (
        response.data &&
        Array.isArray(response.data.recipes)
      ) {
        setRecipes(response.data.recipes)
      } else {
        setRecipes([])
      }
    } catch (error) {
      console.error(
        'Error fetching recipes:',
        error.message
      )

      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  // ----------------------------------------
  // FILTER CHANGE
  // ----------------------------------------
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    }

    setFilters(newFilters)

    const params = new URLSearchParams()

    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) {
        params.set(key, newFilters[key])
      }
    })

    setSearchParams(params)
  }

  // ----------------------------------------
  // CLEAR FILTERS
  // ----------------------------------------
  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      cuisine: '',
      difficulty: '',
      search: ''
    }

    setFilters(emptyFilters)
    setSearchParams({})
  }

  // ----------------------------------------
  // SAVE / UNSAVE RECIPE
  // ----------------------------------------
  const handleToggleSave = async (e, recipeId) => {
    e.stopPropagation()

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/recipes/${recipeId}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.isSaved) {
        setSavedRecipeIds(prev => {
          if (prev.includes(recipeId)) {
            return prev
          }

          return [...prev, recipeId]
        })
      } else {
        setSavedRecipeIds(prev =>
          prev.filter(id => id !== recipeId)
        )
      }
    } catch (error) {
      console.error(
        'Error toggling bookmark:',
        error
      )
    }
  }

  // ----------------------------------------
  // RECIPE IMAGE HANDLER
  // ----------------------------------------
  const handleImageError = (e) => {
    if (e.target.src !== FALLBACK_IMAGE) {
      e.target.src = FALLBACK_IMAGE
    }
  }

  // ----------------------------------------
  // OPEN RECIPE
  // ----------------------------------------
  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`)
  }

  return (
    <div className="browse-recipes">

      <Header />

      <div className="browse-content">

        <div className="container">

          {/* PAGE HEADER */}
          <div className="page-header">
            <h1>Browse Recipes 🍽️</h1>

            <p>
              Explore delicious culinary creations
              shared by our community
            </p>
          </div>

          <div className="browse-layout">

            {/* =========================
                FILTER SIDEBAR
            ========================== */}

            <div className="filters-sidebar">

              <div className="filter-sidebar-header">

                <h3>
                  <span className="filter-icon">
                    🎛️
                  </span>

                  Filter Recipes
                </h3>

                {(
                  filters.category ||
                  filters.cuisine ||
                  filters.difficulty ||
                  filters.search
                ) && (
                  <button
                    className="clear-btn"
                    onClick={clearFilters}
                  >
                    ↺ Reset All
                  </button>
                )}

              </div>

              {/* SEARCH */}

              <div className="filter-group">

                <label>
                  <span className="label-icon">
                    🔍
                  </span>

                  Search Keywords
                </label>

                <input
                  type="text"
                  placeholder="Title or ingredient..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange(
                      'search',
                      e.target.value
                    )
                  }
                  className="filter-input"
                />

              </div>

              {/* CATEGORY */}

              <div className="filter-group">

                <label>
                  <span className="label-icon">
                    🏷️
                  </span>

                  Category
                </label>

                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange(
                      'category',
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    All Categories
                  </option>

                  <option value="breakfast">
                    Breakfast
                  </option>

                  <option value="lunch">
                    Lunch
                  </option>

                  <option value="dinner">
                    Dinner
                  </option>

                  <option value="dessert">
                    Dessert
                  </option>

                  <option value="snack">
                    Snack
                  </option>

                </select>

              </div>

              {/* CUISINE */}

              <div className="filter-group">

                <label>
                  <span className="label-icon">
                    🌐
                  </span>

                  Cuisine
                </label>

                <select
                  value={filters.cuisine}
                  onChange={(e) =>
                    handleFilterChange(
                      'cuisine',
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    All Cuisines
                  </option>

                  <option value="italian">
                    Italian
                  </option>

                  <option value="mexican">
                    Mexican
                  </option>

                  <option value="asian">
                    Asian
                  </option>

                  <option value="american">
                    American
                  </option>

                  <option value="french">
                    French
                  </option>

                  <option value="indian">
                    Indian
                  </option>

                </select>

              </div>

              {/* DIFFICULTY */}

              <div className="filter-group">

                <label>
                  <span className="label-icon">
                    ⚡
                  </span>

                  Difficulty
                </label>

                <select
                  value={filters.difficulty}
                  onChange={(e) =>
                    handleFilterChange(
                      'difficulty',
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    All Levels
                  </option>

                  <option value="easy">
                    Easy
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="hard">
                    Hard
                  </option>

                </select>

              </div>

            </div>

            {/* =========================
                RECIPES CONTENT
            ========================== */}

            <div className="recipes-content">

              {/* LOADING */}

              {loading ? (

                <div className="loading">
                  🍳 Fetching delicious recipes...
                </div>

              ) : recipes.length === 0 ? (

                /* EMPTY STATE */

                <div className="empty-state">

                  <div className="empty-icon">
                    🔎
                  </div>

                  <h3>
                    No recipes found
                  </h3>

                  <p>
                    Try adjusting your search
                    criteria or resetting filters.
                  </p>

                  <button
                    className="btn btn-outline"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>

                </div>

              ) : (

                /* RECIPE GRID */

                <div className="recipe-grid">

                  {recipes.map(recipe => {

                    const isSaved =
                      savedRecipeIds.includes(
                        recipe._id
                      )

                    return (

                      <div
                        key={recipe._id}
                        className="recipe-card clickable"
                        onClick={() =>
                          handleRecipeClick(
                            recipe._id
                          )
                        }
                      >

                        {/* IMAGE */}

                        <div className="recipe-image">

                          <img
                            src={
                              recipe.image ||
                              FALLBACK_IMAGE
                            }
                            alt={
                              recipe.title ||
                              'Recipe'
                            }
                            onError={
                              handleImageError
                            }
                            loading="lazy"
                          />

                          {/* SAVE BUTTON */}

                          <button
                            className={`bookmark-btn ${
                              isSaved
                                ? 'saved'
                                : ''
                            }`}
                            onClick={(e) =>
                              handleToggleSave(
                                e,
                                recipe._id
                              )
                            }
                            title={
                              isSaved
                                ? 'Remove bookmark'
                                : 'Save recipe'
                            }
                          >
                            {isSaved
                              ? '❤️'
                              : '🤍'}
                          </button>

                          {/* CATEGORY */}

                          <span className="recipe-category-tag">
                            {recipe.category ||
                              'Recipe'}
                          </span>

                        </div>

                        {/* RECIPE DETAILS */}

                        <div className="recipe-content">

                          <h3>
                            {recipe.title ||
                              'Untitled Recipe'}
                          </h3>

                          <div className="recipe-meta">

                            <span>
                              👩‍🍳{' '}
                              {recipe.authorName ||
                                'Chef'}
                            </span>

                            <span>
                              ⏱️{' '}
                              {(recipe.prepTime ||
                                0) +
                                (recipe.cookTime ||
                                  0)}{' '}
                              min
                            </span>

                            <span>
                              💪{' '}
                              {recipe.difficulty ||
                                'Medium'}
                            </span>

                          </div>

                          {/* RATING */}

                          <div className="rating-row">

                            <div className="rating">

                              ⭐{' '}

                              {recipe.rating
                                ? Number(
                                    recipe.rating
                                  ).toFixed(1)
                                : '5.0'}

                              <span className="reviews-count">
                                (
                                {recipe.numReviews ||
                                  1}
                                )
                              </span>

                            </div>

                            <span className="view-link">
                              View Recipe →
                            </span>

                          </div>

                        </div>

                      </div>

                    )
                  })}

                </div>

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