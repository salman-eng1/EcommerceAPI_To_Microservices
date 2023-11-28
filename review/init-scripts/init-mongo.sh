#!/bin/bash

mongosh -u mongo -p mongo@suLY <<EOF

use review_DB;

db.createUser({
  user: "review_user",
  pwd: "mongo@suLY", // Replace with a secure password
  roles: [{ role: "readWrite", db: "review_DB" }]
});
EOF
