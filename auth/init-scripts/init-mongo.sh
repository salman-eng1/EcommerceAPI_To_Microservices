#!/bin/bash

mongosh <<EOF

use auth_DB;

db.createUser({
  user: "auth_user",
  pwd: "mongo@suLY", // Replace with a secure password
  roles: [{ role: "readWrite", db: "auth_DB" }]
});
EOF
