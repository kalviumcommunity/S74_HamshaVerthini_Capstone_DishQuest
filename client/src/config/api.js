export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://s74-hamshaverthini-capstone-dishquest-10.onrender.com'

export const DEFAULT_RECIPE_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop'

export const getRecipeImageUrl = (image) => {
  if (!image || typeof image !== 'string') {
    return DEFAULT_RECIPE_IMAGE
  }

  // Handle localhost URLs stored in DB
  if (image.includes('localhost:5000')) {
    const parts = image.split('localhost:5000')
    const relativePath = parts[1] || ''
    if (relativePath.startsWith('/uploads')) {
      return `${API_BASE_URL}${relativePath}`
    }
    return DEFAULT_RECIPE_IMAGE
  }

  // Handle relative upload paths
  if (image.startsWith('/uploads')) {
    return `${API_BASE_URL}${image}`
  }

  return image
}
