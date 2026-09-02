import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './RecipeDetail.css'

const RecipeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('ingredients')
  const [recipe, setRecipe] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    fetchRecipe()
    fetchReviews()
    checkSavedStatus()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${id}`)
      if (response.data) {
        setRecipe(response.data)
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/${id}`)
      setReviews(response.data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const checkSavedStatus = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data && response.data.user) {
        const savedIds = (response.data.user.savedRecipes || []).map(r => typeof r === 'object' ? r._id : r)
        setIsSaved(savedIds.includes(id))
      }
    } catch (err) {
      console.error('Error checking saved status:', err)
    }
  }

  const handleToggleSave = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/recipes/${id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIsSaved(response.data.isSaved)
    } catch (err) {
      console.error('Error toggling bookmark:', err)
    }
  }

  const handleCheckboxToggle = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    if (!newReview.comment.trim()) return

    setSubmittingReview(true)
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        recipeId: id,
        rating: Number(newReview.rating),
        comment: newReview.comment.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      setNewReview({ rating: 5, comment: '' })
      fetchReviews()
      fetchRecipe()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please log in first.')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="recipe-detail">
        <Header />
        <div className="loading-container">🍳 Preparing recipe details...</div>
        <Footer />
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="recipe-detail">
        <Header />
        <div className="error-container">
          <h2>Recipe Not Found</h2>
          <p>The recipe you are looking for does not exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate('/browse')}>
            Browse Recipes
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="recipe-detail">
      <Header />
      
      <div className="recipe-detail-body">
        <div className="container">
          {/* Recipe Hero Card */}
          <div className="recipe-hero">
            <div className="recipe-hero-image">
              <img 
                src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop"} 
                alt={recipe.title} 
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop"
                }}
              />
              <button 
                className={`detail-bookmark-btn ${isSaved ? 'saved' : ''}`}
                onClick={handleToggleSave}
                title={isSaved ? "Saved in bookmarks" : "Save recipe"}
              >
                {isSaved ? '❤️ Saved' : '🤍 Bookmark'}
              </button>
            </div>

            <div className="recipe-hero-info">
              <div className="category-badge">{recipe.category} • {recipe.cuisine}</div>
              <h1 className="detail-title">{recipe.title}</h1>
              <p className="detail-author">By <span>{recipe.authorName || 'Chef'}</span></p>

              <p className="detail-desc">{recipe.description}</p>

              <div className="detail-stats-grid">
                <div className="stat-card">
                  <span className="stat-icon">⏱️</span>
                  <div className="stat-data">
                    <span className="stat-label">Prep Time</span>
                    <span className="stat-val">{recipe.prepTime || 15} min</span>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">🍳</span>
                  <div className="stat-data">
                    <span className="stat-label">Cook Time</span>
                    <span className="stat-val">{recipe.cookTime || 20} min</span>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">👥</span>
                  <div className="stat-data">
                    <span className="stat-label">Servings</span>
                    <span className="stat-val">{recipe.servings || 4}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">⭐</span>
                  <div className="stat-data">
                    <span className="stat-label">Rating</span>
                    <span className="stat-val">{recipe.rating ? recipe.rating.toFixed(1) : "5.0"} ({recipe.numReviews || reviews.length})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="tabs-bar">
            <button 
              className={`tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`}
              onClick={() => setActiveTab('ingredients')}
            >
              🥗 Ingredients
            </button>
            <button 
              className={`tab-btn ${activeTab === 'instructions' ? 'active' : ''}`}
              onClick={() => setActiveTab('instructions')}
            >
              👩‍🍳 Instruction Steps
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              📝 Notes & Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="tab-pane">
            {activeTab === 'ingredients' && (
              <div className="ingredients-pane">
                <h2>Ingredients Required</h2>
                <p className="tab-hint">Check off ingredients as you prepare your dish:</p>
                <ul className="ingredients-checklist">
                  {recipe.ingredients && recipe.ingredients.map((ingredient, idx) => (
                    <li 
                      key={idx} 
                      className={`checklist-item ${checkedIngredients[idx] ? 'checked' : ''}`}
                      onClick={() => handleCheckboxToggle(idx)}
                    >
                      <input 
                        type="checkbox" 
                        checked={!!checkedIngredients[idx]} 
                        onChange={() => {}}
                      />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="instructions-pane">
                <h2>Step-by-Step Cooking Instructions</h2>
                <ol className="instructions-steps">
                  {recipe.instructions && recipe.instructions.map((step, idx) => (
                    <li key={idx} className="step-card">
                      <div className="step-number">{idx + 1}</div>
                      <div className="step-text">{step}</div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-pane">
                {recipe.notes && (
                  <div className="chef-notes-box">
                    <h3>💡 Chef's Special Notes</h3>
                    <p>{recipe.notes}</p>
                  </div>
                )}

                <div className="reviews-list-section">
                  <h2>Community Reviews</h2>
                  {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to share your thoughts!</p>
                  ) : (
                    <div className="reviews-cards-list">
                      {reviews.map(rev => (
                        <div key={rev._id || rev.id} className="review-card">
                          <div className="review-card-header">
                            <div className="reviewer-info">
                              <span className="reviewer-avatar">👤</span>
                              <div>
                                <h4 className="reviewer-name">{rev.userName || 'Food Lover'}</h4>
                                <span className="review-date">
                                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                                </span>
                              </div>
                            </div>
                            <div className="review-stars">
                              {'⭐'.repeat(rev.rating)}
                            </div>
                          </div>
                          <p className="review-text">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="add-review-box">
                  <h3>Leave a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <div className="form-group">
                      <label>Your Rating</label>
                      <select 
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                        className="rating-select"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                        <option value={3}>⭐⭐⭐ (3 - Good)</option>
                        <option value={2}>⭐⭐ (2 - Fair)</option>
                        <option value={1}>⭐ (1 - Needs Improvement)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Your Feedback / Experience</label>
                      <textarea
                        rows="4"
                        placeholder="Write your review here..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default RecipeDetail
