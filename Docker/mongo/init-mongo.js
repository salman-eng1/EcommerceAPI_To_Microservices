// Create the ec_DB database
db = db.getSiblingDB('ec_DB');

// Create a user with the desired username and password
//use ec_DB
db.createUser({
  user: "ec_User",
  pwd: "mongo@suLY", // Replace with a secure password
  roles: [{ role: "dbOwner", db: "ec_DB" }]
})
