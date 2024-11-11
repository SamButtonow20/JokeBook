const db = require('./database'); // Assuming this is your database connection

async function getCategories() {
  const sql = "SELECT id, name FROM Categories";
  try {
    const categories = await db.all(sql);
    console.log('Categories fetched from DB in getCategories:', categories);
    return categories;
  } catch (error) {
    console.error("Error fetching categories from DB:", error);
    throw new Error("Database error: Unable to fetch categories."); // Throw an error for the route to catch
  }
}


async function getJokesByCategory(categoryName, limit = 10) {
  const query = `
    SELECT j.id, j.setup, j.delivery
    FROM Jokes j
    JOIN Categories c ON j.category_id = c.id
    WHERE c.name = ?
    LIMIT ?`;
  
  try {
    const jokes = await db.all(query, [categoryName, limit]);
    console.log('Fetched jokes:', jokes);  // Log the jokes to check
    return jokes;
  } catch (error) {
    console.error("Error fetching jokes by category:", error);
    throw error;
  }
}

async function addJoke(joke) {
  const { category, setup, delivery } = joke;

  try {
    // Get the category ID based on the category name
    const categoryId = await getCategoryIdByName(category);

    // Insert the new joke into the Jokes table
    const result = await db.run(
      "INSERT INTO Jokes (category_id, setup, delivery) VALUES (?, ?, ?)",
      [categoryId, setup, delivery]
    );

    // Return the newly added joke
    const newJoke = await db.get(
      "SELECT * FROM Jokes WHERE id = ?",
      [result.lastInsertRowid]
    );

    return newJoke;
  } catch (error) {
    console.error("Error adding joke:", error);
    throw error; // Rethrow the error so the controller can handle it
  }
}



// Get a specific joke by its ID
async function getJokeById(id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Jokes WHERE id = ?";
    const params = [id];  // Ensure id is a valid number or string

    // Use db.get() to fetch a single joke by its ID
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('Error fetching joke by ID:', err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Get a random joke from the Jokes table
async function getRandomJoke() {
  return new Promise((resolve, reject) => {
    const query = "SELECT setup, delivery FROM Jokes ORDER BY RANDOM() LIMIT 1";
    
    // Use db.get() to fetch a single random joke
    db.get(query, [], (err, joke) => {
      if (err) {
        reject(err);  // reject if error occurs
      } else {
        resolve(joke);  // resolve with joke data
      }
    });
  });
}

async function getCategoryIdByName(categoryName) {
  console.log("Checking category:", categoryName); // Log the category being checked

  if (!categoryName) {
    throw new Error("Category name is required");
  }

  try {
    // Check if the category exists first
    const result = await db.get("SELECT id FROM Categories WHERE name = ?", [categoryName]);

    if (result) {
      console.log("Category found:", result);
      return result.id;
    }

    // If category doesn't exist, insert it
    console.log("Category not found. Inserting category:", categoryName);
    await db.run("INSERT INTO Categories (name) VALUES (?)", [categoryName]);

    // Return the newly inserted category ID
    const newCategoryResult = await db.get("SELECT id FROM Categories WHERE name = ?", [categoryName]);
    return newCategoryResult.id;
  } catch (error) {
    console.error("Error handling category:", error);
    throw error;
  }
}






module.exports = { getCategories, addJoke, getJokesByCategory, getRandomJoke, getJokeById, getCategoryIdByName };
