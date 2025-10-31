import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './AddRecipe.css'

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    cuisine: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    ingredients: '',
    instructions: '',
    notes: '',
    image: null
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
      setPreview(URL.createObjectURL(files[0]))
      setUploadSuccess(true)
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const submitData = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key])
        }
      })

      await axios.post('http://localhost:5000/api/recipes', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      navigate('/recipe-submitted')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit recipe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-recipe">
      <Header />

      <div className="add-recipe-content">
        <div className="container">
          <div className="page-header">
            <h1>Share Your Recipe</h1>
            <p>Share your culinary masterpiece with the community</p>
          </div>

          <div className="form-container">
            <form onSubmit={handleSubmit} className="recipe-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Recipe Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter recipe title"
                  />
                </div>

                {/* ✅ Upload with Preview */}
                <div className="form-group image-upload-group">
                  <label htmlFor="image">Upload Image</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <label htmlFor="image" className="file-upload-label">
                      {preview ? (
                        <img src={preview} alt="Preview" className="preview-image" />
                      ) : (
                        'Choose Image'
                      )}
                    </label>
                  </div>
                  {uploadSuccess && (
                    <p className="upload-success">
                      ✅ {formData.image?.name} uploaded successfully
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe your recipe..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="dessert">Dessert</option>
                    <option value="snack">Snack</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="beverage">Beverage</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="cuisine">Cuisine *</label>
                  <select
                    id="cuisine"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Cuisine</option>
                    <option value="italian">Italian</option>
                    <option value="mexican">Mexican</option>
                    <option value="asian">Asian</option>
                    <option value="american">American</option>
                    <option value="indian">Indian</option>
                    <option value="french">French</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prepTime">Prep Time (minutes) *</label>
                  <input
                    type="number"
                    id="prepTime"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g., 15"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cookTime">Cook Time (minutes) *</label>
                  <input
                    type="number"
                    id="cookTime"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g., 30"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="servings">Servings *</label>
                  <input
                    type="number"
                    id="servings"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g., 4"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ingredients">Ingredients *</label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="List ingredients, one per line..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="instructions">Instructions *</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  required
                  rows="8"
                  placeholder="Write step-by-step instructions..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any additional tips or notes..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                  {loading ? 'Submitting Recipe...' : 'Submit Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AddRecipe
