const db = require('./db-conn')

function getCategories () {
  let sql = 'SELECT * FROM categories;'
  const data = db.all(sql)
  return data
}

function getCategoryId(name){
  let sql = `select id from categories where name =?`;
  const data = db.all(sql, name);
  return data;
}

function getRandom () {
  let sql = `
  select j.setup, j.delivery, c.name
  from jokes j
  join categories c on c.id = j.category_id
  order by random()
  limit 1;
  `

  const data = db.all(sql)
  return data
}
function categoryExists(category_name) {
  const sql = 'SELECT 1 FROM categories WHERE name = ? LIMIT 1;';
  return db.get(sql, category_name) !== undefined;
}

function addCategory (category_name) {
  data = categoryExists(category_name)
  if (data) {
    return;
  }

  let sql = `
  insert into categories(name) values(?);
  `
  return db.run(sql, category_name)
}

function addNewJoke (newJoke) {
  addCategory(newJoke.category);
  const category_id = getCategoryId(newJoke.category); 
  console.log("id: ", category_id);

  console.log("Category_id", category_id);
  console.log("new joke", newJoke);

  let sql = `
  insert into jokes(category_id, setup, delivery) values (?, ?, ?);
  `;


  return db.run(sql, category_id[0].id, newJoke.setup, newJoke.delivery);
}

function getAllByOneCategory (name) {
  const category = `%${name}%`
  let sql = `
  select *
  from jokes j
  join categories c on c.id = j.category_id
  where c.name like ?;
  `

  const data = db.all(sql, category)

  return data
}

module.exports = {
  getCategories,
  getRandom,
  getAllByOneCategory,
  addCategory,
  addNewJoke
}
