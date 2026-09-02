const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("./models/recipe");
const Review = require("./models/review");
const User = require("./models/user");
const bcrypt = require("bcrypt");

dotenv.config();

const sampleRecipes = [
  {
    title: "Mexican Street Corn Tacos",
    description: "Zesty street corn tacos packed with fresh avocado, cotija cheese, spicy mayo, and fresh cilantro on warm corn tortillas.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
    category: "lunch",
    cuisine: "mexican",
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    authorName: "Sofia Rodriguez",
    rating: 4.9,
    numReviews: 12,
    ingredients: [
      "4 ears fresh sweet corn, husked",
      "8 small corn tortillas",
      "1/2 cup crumbled cotija cheese",
      "1/4 cup mayonnaise",
      "2 tbsp sour cream",
      "1 tbsp lime juice",
      "1 tsp chili powder",
      "1 avocado, sliced",
      "Fresh cilantro & lime wedges for serving"
    ],
    instructions: [
      "Grill corn on medium-high heat for 10-12 minutes until nicely charred on all sides.",
      "In a small bowl, whisk together mayonnaise, sour cream, lime juice, and chili powder.",
      "Cut corn kernels off the cob into a bowl and mix with the mayo sauce.",
      "Warm corn tortillas on the grill or skillet for 30 seconds per side.",
      "Assemble tacos with corn mixture, sliced avocado, crumbled cotija, and fresh cilantro."
    ],
    notes: "For extra heat, add finely chopped jalapenos or a dash of hot sauce before serving."
  },
  {
    title: "Creamy Tuscan Garlic Chicken",
    description: "Tender chicken breasts simmered in a rich garlic parmesan cream sauce with sun-dried tomatoes and fresh spinach.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=800&h=600&fit=crop",
    category: "dinner",
    cuisine: "italian",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    authorName: "Maria Johnson",
    rating: 4.8,
    numReviews: 18,
    ingredients: [
      "4 boneless skinless chicken breasts",
      "2 cups fresh baby spinach",
      "1/2 cup sun-dried tomatoes, drained and sliced",
      "4 cloves garlic, minced",
      "1 cup heavy cream",
      "1/2 cup freshly grated parmesan cheese",
      "2 tbsp olive oil",
      "1 tsp Italian seasoning",
      "Salt and fresh cracked black pepper to taste"
    ],
    instructions: [
      "Season chicken breasts with salt, pepper, and Italian seasoning.",
      "Heat olive oil in a large skillet over medium-high heat and sear chicken 6-7 mins per side until golden.",
      "Remove chicken from skillet and set aside on a plate.",
      "In the same skillet, add minced garlic and sun-dried tomatoes; sauté for 1 minute.",
      "Pour in heavy cream and bring to a gentle simmer, then stir in grated parmesan.",
      "Add baby spinach and cook until wilted.",
      "Return chicken to skillet, coat with sauce, and simmer for 3 minutes before serving."
    ],
    notes: "Serve over fettuccine or with garlic bread to soak up the delicious sauce."
  },
  {
    title: "Spicy Thai Basil Noodles",
    description: "Stir-fried rice noodles in a sweet & spicy Thai basil sauce with colorful peppers, garlic, and fresh Thai basil leaves.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop",
    category: "dinner",
    cuisine: "asian",
    prepTime: 15,
    cookTime: 15,
    servings: 3,
    difficulty: "Easy",
    authorName: "Alex Chan",
    rating: 4.7,
    numReviews: 9,
    ingredients: [
      "8 oz flat rice noodles",
      "1 cup fresh Thai holy basil leaves",
      "3 cloves garlic, minced",
      "2 Thai red chilies, chopped",
      "1 red bell pepper, sliced",
      "3 tbsp soy sauce",
      "1 tbsp fish sauce (or extra soy sauce)",
      "1 tbsp dark soy sauce",
      "1 tbsp brown sugar",
      "2 tbsp vegetable oil"
    ],
    instructions: [
      "Soak rice noodles in warm water for 20 minutes according to package directions, then drain.",
      "Mix soy sauce, fish sauce, dark soy sauce, and brown sugar in a bowl.",
      "Heat vegetable oil in a wok or large skillet over high heat.",
      "Add garlic and red chilies, sauté for 30 seconds until fragrant.",
      "Add sliced bell peppers and toss for 2 minutes.",
      "Add drained noodles and sauce mixture; stir-fry vigorously for 2-3 minutes.",
      "Turn off heat, stir in fresh Thai basil leaves until wilted, and serve hot."
    ],
    notes: "You can add chicken, shrimp, or tofu for extra protein."
  },
  {
    title: "Classic Italian Margherita Pizza",
    description: "Authentic Neapolitan style pizza topped with sweet San Marzano tomato sauce, fresh mozzarella fior di latte, and basil.",
    image: "https://images.unsplash.com/photo-1601924638867-3ec62b6741dc?w=800&h=600&fit=crop",
    category: "dinner",
    cuisine: "italian",
    prepTime: 20,
    cookTime: 15,
    servings: 2,
    difficulty: "Medium",
    authorName: "Marco Rossi",
    rating: 4.9,
    numReviews: 24,
    ingredients: [
      "1 lb fresh pizza dough",
      "1/2 cup canned San Marzano crushed tomatoes",
      "7 oz fresh mozzarella cheese, sliced",
      "10 fresh basil leaves",
      "2 tbsp extra virgin olive oil",
      "Pinch of sea salt"
    ],
    instructions: [
      "Preheat oven with pizza stone at 500°F (260°C) for at least 30 minutes.",
      "Stretch dough on parchment paper into a 12-inch circle.",
      "Spread crushed tomatoes evenly over dough, leaving a 1-inch border.",
      "Arrange fresh mozzarella slices over tomato sauce.",
      "Bake for 10-12 minutes until crust is puffed and golden brown with charred spots.",
      "Garnish with fresh basil leaves and drizzle with extra virgin olive oil."
    ],
    notes: "Bake at the highest temperature your oven supports for authentic bubbly crust."
  },
  {
    title: "Decadent Chocolate Lava Cake",
    description: "Warm individual chocolate cakes with a rich gooey molten chocolate center, served with vanilla bean ice cream.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
    category: "dessert",
    cuisine: "french",
    prepTime: 15,
    cookTime: 12,
    servings: 2,
    difficulty: "Hard",
    authorName: "Emma Wilson",
    rating: 4.9,
    numReviews: 31,
    ingredients: [
      "4 oz high quality bittersweet chocolate",
      "1/2 cup unsalted butter",
      "2 whole eggs + 2 egg yolks",
      "1/4 cup granulated sugar",
      "2 tbsp all-purpose flour",
      "Pinch of salt",
      "Powdered sugar & vanilla ice cream for serving"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C). Butter and cocoa powder two 6 oz ramekins.",
      "Melt chocolate and butter together in a heatproof bowl set over simmering water.",
      "In a separate bowl, whisk eggs, egg yolks, sugar, and salt until pale and thick.",
      "Fold melted chocolate mixture into egg mixture, then gently fold in flour.",
      "Divide batter between ramekins and bake for 12 minutes until edges are firm but center is soft.",
      "Invert onto plates, dust with powdered sugar, and serve immediately with ice cream."
    ],
    notes: "Timing is crucial! 12 minutes gives a perfectly runny molten center."
  },
  {
    title: "Nutritious Vegetarian Buddha Bowl",
    description: "Vibrant rainbow bowl featuring fluffy quinoa, roasted chickpeas, avocado, kale, and lemon tahini dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    category: "lunch",
    cuisine: "american",
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: "Easy",
    authorName: "Sarah Green",
    rating: 4.6,
    numReviews: 15,
    ingredients: [
      "1 cup cooked quinoa",
      "1 can (15 oz) chickpeas, rinsed and roasted with paprika",
      "1 ripe avocado, sliced",
      "2 cups chopped curly kale, massaged with olive oil",
      "1/2 cup shredded purple cabbage",
      "1/2 cup roasted sweet potato cubes",
      "3 tbsp tahini",
      "1 tbsp lemon juice",
      "1 tbsp maple syrup",
      "Warm water to thin dressing"
    ],
    instructions: [
      "Toss chickpeas with paprika, olive oil, and salt; roast at 400°F for 20 minutes until crunchy.",
      "Whisk tahini, lemon juice, maple syrup, and 2 tbsp warm water until smooth.",
      "Divide quinoa between two serving bowls.",
      "Arrange roasted chickpeas, avocado slices, massaged kale, purple cabbage, and sweet potato around quinoa.",
      "Drizzle generously with lemon tahini dressing before serving."
    ],
    notes: "Great for meal prep! Keep dressing separate until ready to eat."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Check if test user exists or create one
    let testUser = await User.findOne({ email: "chef.demo@dishquest.com" });
    if (!testUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      testUser = await User.create({
        username: "DemoChef",
        email: "chef.demo@dishquest.com",
        password: hashedPassword,
        fullName: "Master Chef Alex",
        bio: "Culinary artist and food blogger sharing my favorite recipes from around the globe.",
        avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&h=150&fit=crop&crop=face"
      });
      console.log("Demo user created!");
    }

    // Clear existing recipes if any
    await Recipe.deleteMany({});
    console.log("Cleared existing recipes.");

    // Insert sample recipes
    const createdRecipes = await Recipe.insertMany(
      sampleRecipes.map(r => ({
        ...r,
        createdBy: testUser._id
      }))
    );
    console.log(`Successfully seeded ${createdRecipes.length} recipes!`);

    // Insert sample review for first recipe
    await Review.deleteMany({});
    await Review.create([
      {
        recipeId: createdRecipes[0]._id,
        userId: testUser._id,
        userName: "Elena Vance",
        rating: 5,
        comment: "Made these tacos for Friday night dinner and everyone LOVED them! The grilled corn mayo combination is unbeatable."
      },
      {
        recipeId: createdRecipes[1]._id,
        userId: testUser._id,
        userName: "David Kim",
        rating: 5,
        comment: "The garlic cream sauce is so rich and flavorful. Served over penne pasta. Will definitely make again!"
      }
    ]);
    console.log("Successfully seeded sample reviews!");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
