#!/bin/bash

mongosh -u mongo -p mongo@suLY <<EOF

use cart_DB;

db.createUser({
  user: "cart_user",
  pwd: "mongo@suLY", // Replace with a secure password
  roles: [{ role: "readWrite", db: "cart_DB" }]
});
EOF
