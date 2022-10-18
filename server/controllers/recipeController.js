require("../models/database");
const category = require("../models/Category");
const Recipe = require('../models/Recipe');

// GET / Homepage
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Recipe.find({'category': 'Thai'}).limit(limitNumber);
    const american = await Recipe.find({'category': 'American'}).limit(limitNumber);
    const chinese = await Recipe.find({'category': 'Chinese'}).limit(limitNumber);
    const food = { latest, thai, american, chinese };
    res.render("index", { title: "Cooking Blog - Home", categories, food });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred"});
  }
};

// GET / Categories
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 6;
    const categories = await category.find({}).limit(limitNumber);
    res.render("categories", { title: "Cooking Blog - categories", categories });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred"});
  }
};

// GET / Categories/:id
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({'category': categoryId}).limit(limitNumber);
    res.render("categories", { title: "Cooking Blog - categories", categoryById });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred"});
  }
};

// GET / recipe/:id
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred"});
  }
};

// POST/search
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({$text: {$search: searchTerm, $diacriticSensitive: true}});
    res.render('search', {title: 'Cooking Blog - Search', recipe});
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred"});
  }
}

// GET /explore-Latest
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    res.render("explore-latest", { title: "Cooking Blog - Explore Latest", recipe });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred"});
  }
};

// GET /explore-Random
exports.exploreRandom = async (req, res) => {
  try {
   let count = await Recipe.find().countDocuments();
   let random = Math.floor(Math.random() * count);
   let recipe = await Recipe.findOne().skip(random).exec();
   res.render("explore-random", { title: "Cooking Blog - Explore Latest", recipe });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred"});
  }
};

/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}


async function insertDamnCategoryData() {
  try {
    await category.insertMany([
      {
        name: "Thai",
        image: "Thai-food.jpg",
      },
      {
        name: "American",
        image: "American-food.jpg",
      },
      {
        name: "Chinese",
        image: "Chinese-food.jpg",
      },
      {
        name: "Mexican",
        image: "Mexican-food.jpg",
      },
      {
        name: "Indian",
        image: "Indian-food.jpg",
      },
      {
        name: "Spanish",
        image: "Spanish-food.jpg",
      },
    ]);
  } catch (error) {
    console.log("err", + error);
  }
}

insertDamnCategoryData();

async function insertDamnRecipeData(){
    try {
      await Recipe.insertMany([
        { 
          "name": "Toasted Egg",
          "description": `Recipe Description Goes Here`,
          "email": "recipeemail@raddy.co.uk",
          "ingredients": [
            "1 level teaspoon baking powder",
            "1 level teaspoon cayenne pepper",
            "1 level teaspoon hot smoked paprika",
          ],
          "category": "Thai", 
          "image": "pexels-daria-shevtsova-704569.jpg"
        },
        { 
          "name": "Egg With Bread",
          "description": `Recipe Description Goes Here`,
          "email": "recipeemail@raddy.co.uk",
          "ingredients": [
            "1 level teaspoon baking powder",
            "1 level teaspoon cayenne pepper",
            "1 level teaspoon hot smoked paprika",
          ],
          "category": "Chinese", 
          "image": "pexels-daria-shevtsova-1824353.jpg"
        },
        { 
          "name": "Mixed Salad With Nachos",
          "description": `Recipe Description Goes Here`,
          "email": "recipeemail@raddy.co.uk",
          "ingredients": [
            "1 level teaspoon baking powder",
            "1 level teaspoon cayenne pepper",
            "1 level teaspoon hot smoked paprika",
          ],
          "category": "American", 
          "image": "pexels-julie-aagaard-2097090.jpg"
        },
        { 
          "name": "Fresh Salad",
          "description": `Recipe Description Goes Here`,
          "email": "recipeemail@raddy.co.uk",
          "ingredients": [
            "1 level teaspoon baking powder",
            "1 level teaspoon cayenne pepper",
            "1 level teaspoon hot smoked paprika",
          ],
          "category": "American", 
          "image": "pexels-monicore-1391487.jpg"
        },
        { 
          "name": "American Pizza",
          "description": `Recipe Description Goes Here`,
          "email": "recipeemail@raddy.co.uk",
          "ingredients": [
            "1 level teaspoon baking powder",
            "1 level teaspoon cayenne pepper",
            "1 level teaspoon hot smoked paprika",
          ],
          "category": "American", 
          "image": "pexels-pixabay-315755.jpg"
        },
      ]);
    } catch (error) {
      console.log('err', + error)
    }
  }
  
  insertDamnRecipeData();
