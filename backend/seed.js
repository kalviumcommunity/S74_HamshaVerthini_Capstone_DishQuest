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
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop",
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
    title: "Crispy Beef Quesadillas",
    description: "Golden melted cheese and seasoned ground beef stuffed inside warm crispy tortillas served with fresh salsa.",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800&h=600&fit=crop",
    category: "dinner",
    cuisine: "mexican",
    prepTime: 10,
    cookTime: 15,
    servings: 3,
    difficulty: "Easy",
    authorName: "Carlos Gomez",
    rating: 4.8,
    numReviews: 14,
    ingredients: [
      "4 large flour tortillas",
      "1/2 lb ground beef, seasoned with taco spice",
      "1.5 cups shredded Mexican cheese blend",
      "1/4 cup diced red onions",
      "2 tbsp chopped fresh cilantro",
      "Sour cream and salsa for serving"
    ],
    instructions: [
      "Brown ground beef in a skillet over medium heat with taco seasoning until fully cooked.",
      "Place tortillas flat and sprinkle cheese over one half of each tortilla.",
      "Top cheese with seasoned beef, red onions, and cilantro, then fold tortillas in half.",
      "Cook on a lightly oiled skillet over medium heat for 3-4 mins per side until golden crisp and cheese is melted.",
      "Slice into triangles and serve hot with sour cream and salsa."
    ],
    notes: "Use Monterey Jack or Cheddar for maximum cheesy meltiness."
  },
  {
    title: "Creamy Tuscan Garlic Chicken",
    description: "Tender chicken breasts simmered in a rich garlic parmesan cream sauce with sun-dried tomatoes and fresh spinach.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop",
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
    title: "Spicy Thai Basil Noodles",
    description: "Stir-fried rice noodles in a sweet & spicy Thai basil sauce with colorful peppers, garlic, and fresh Thai basil leaves.",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&h=600&fit=crop",
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
      "1 tbsp fish sauce",
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
    title: "Authentic Chicken Ramen",
    description: "Rich savory broth with tender sliced chicken, ramen noodles, soft-boiled egg, and fresh green onions.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop",
    category: "dinner",
    cuisine: "asian",
    prepTime: 20,
    cookTime: 30,
    servings: 2,
    difficulty: "Medium",
    authorName: "Kenji Sato",
    rating: 4.9,
    numReviews: 22,
    ingredients: [
      "2 packs ramen noodles",
      "4 cups chicken broth",
      "2 cloves garlic, minced",
      "1 tbsp fresh ginger, grated",
      "2 tbsp soy sauce",
      "1 tbsp mirin",
      "2 soft-boiled eggs, halved",
      "1 cup cooked sliced chicken breast",
      "Green onions & sesame seeds for garnish"
    ],
    instructions: [
      "Simmer chicken broth with garlic, ginger, soy sauce, and mirin for 15 minutes.",
      "Cook ramen noodles in boiling water for 3 minutes, then drain.",
      "Divide noodles into warm bowls and ladle hot broth over noodles.",
      "Top with sliced chicken, soft-boiled egg halves, sliced green onions, and sesame seeds."
    ],
    notes: "Drizzle with chili oil for extra heat."
  },
  {
    title: "Classic Smash Cheeseburger",
    description: "Juicy double beef patties with melted cheddar, crisp lettuce, pickles, and secret sauce on a toasted brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    category: "lunch",
    cuisine: "american",
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    authorName: "Jake Miller",
    rating: 4.9,
    numReviews: 35,
    ingredients: [
      "1/2 lb ground beef (80/20 mix), formed into 4 balls",
      "4 slices American or cheddar cheese",
      "2 brioche burger buns, toasted",
      "Dill pickle slices",
      "2 tbsp burger sauce (mayo, ketchup, relish mix)",
      "Salt & freshly cracked black pepper"
    ],
    instructions: [
      "Heat a cast iron skillet over high heat until smoking hot.",
      "Place beef balls in skillet and smash down paper-thin with a heavy spatula.",
      "Season heavily with salt and pepper, sear 2 mins until crispy brown edges form.",
      "Flip patties, immediately top with cheese slices, and cook for 1 minute.",
      "Assemble double cheeseburgers on toasted brioche buns with pickles and sauce."
    ],
    notes: "A smoking hot cast iron skillet is key to getting crispy lacy burger edges!"
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
  },
  {
    title: "Avocado & Poached Egg Toast",
    description: "Crispy sourdough toast topped with mashed creamy avocado, soft poached eggs, and red chili flakes.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop",
    category: "breakfast",
    cuisine: "american",
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    difficulty: "Easy",
    authorName: "Chloe Adams",
    rating: 4.8,
    numReviews: 19,
    ingredients: [
      "2 slices thick sourdough bread, toasted",
      "1 ripe Hass avocado",
      "2 fresh eggs",
      "1 tbsp lemon juice",
      "Pinch of sea salt and red pepper flakes",
      "Everything bagel seasoning"
    ],
    instructions: [
      "Mash avocado in a bowl with lemon juice, salt, and pepper.",
      "Poach eggs in simmering water with a splash of vinegar for 3-4 minutes.",
      "Spread mashed avocado over warm sourdough toast.",
      "Top with poached eggs and sprinkle with red pepper flakes and everything bagel seasoning."
    ],
    notes: "Serve immediately while egg yolks are warm and runny."
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
    title: "Classic French Butter Croissant",
    description: "Flaky, golden-brown buttery pastry with delicate layers, baked fresh for breakfast or brunch.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop",
    category: "breakfast",
    cuisine: "french",
    prepTime: 30,
    cookTime: 20,
    servings: 6,
    difficulty: "Hard",
    authorName: "Pierre Laurent",
    rating: 4.9,
    numReviews: 28,
    ingredients: [
      "3 cups bread flour",
      "1 cup cold European butter (82% fat)",
      "1/4 cup sugar",
      "1 tbsp active dry yeast",
      "1 tsp salt",
      "1 cup cold milk",
      "1 egg for egg wash"
    ],
    instructions: [
      "Prepare laminated yeast dough with butter block through 3 folds, chilling between folds.",
      "Roll dough out to 1/4 inch thickness and cut into isosceles triangles.",
      "Roll triangles up from base to point to shape croissants.",
      "Proof for 2 hours until puffy, brush with egg wash, and bake at 400°F (200°C) for 18-20 mins."
    ],
    notes: "Keep dough cold during laminating so butter layers don't melt!"
  },
  {
    title: "Rich Butter Chicken Makhani",
    description: "Tender chicken cooked in a smooth, creamy tomato and butter sauce seasoned with aromatic Indian spices.",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&h=600&fit=crop",
    category: "dinner",
    cuisine: "indian",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    authorName: "Priya Sharma",
    rating: 4.9,
    numReviews: 42,
    ingredients: [
      "1.5 lbs chicken thighs, cut into bite-sized pieces",
      "1 cup plain yogurt",
      "2 tbsp garam masala",
      "1 tbsp ginger garlic paste",
      "1.5 cups canned tomato puree",
      "1/2 cup heavy cream",
      "3 tbsp butter",
      "1 tsp kasuri methi (dried fenugreek leaves)",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Marinate chicken in yogurt, garam masala, and ginger garlic paste for at least 30 minutes.",
      "Sear marinated chicken pieces in skillet over high heat until browned.",
      "In a saucepan, melt butter and simmer tomato puree with remaining spices for 10 minutes.",
      "Stir in heavy cream, add chicken, and simmer gently for 15 minutes until chicken is tender.",
      "Garnish with crushed kasuri methi and fresh cilantro. Serve hot with garlic naan!"
    ],
    notes: "Pair with warm garlic naan or basmati rice."
  },
  {
    title: "Fragrant Vegetable Biryani",
    description: "Aromatic basmati rice layered with spiced mixed vegetables, saffron milk, mint, and crispy caramelized onions.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=800&h=600&fit=crop",
    category: "dinner",
    cuisine: "indian",
    prepTime: 25,
    cookTime: 35,
    servings: 4,
    difficulty: "Medium",
    authorName: "Aarav Patel",
    rating: 4.8,
    numReviews: 26,
    ingredients: [
      "2 cups long-grain basmati rice, soaked",
      "2 cups mixed chopped vegetables (carrots, peas, potatoes, beans)",
      "1/2 cup yogurt",
      "2 large onions, thinly sliced & fried golden",
      "2 tbsp biryani masala",
      "1/4 cup fresh mint and cilantro leaves",
      "2 tbsp ghee",
      "Warm saffron milk"
    ],
    instructions: [
      "Parboil basmati rice with whole spices (cardamom, cloves, bay leaf) until 70% cooked.",
      "Sauté mixed vegetables in ghee with biryani masala and yogurt until half tender.",
      "Layer cooked vegetable curry and parboiled rice in a heavy pot.",
      "Drizzle saffron milk, fried onions, mint, and cilantro over top layer.",
      "Cover tightly with lid and cook on low heat (Dum) for 20 minutes."
    ],
    notes: "Serve with chilled cucumber raita."
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

    // Insert sample reviews
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
        recipeId: createdRecipes[2]._id,
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
