#!/bin/bash

mongosh -u mongo -p mongo@suLY <<EOF

use catalog_DB;

db.createUser({
  user: "catalog_user",
  pwd: "mongo@suLY", // Replace with a secure password
  roles: [{ role: "readWrite", db: "catalog_DB" }]
});
EOF
