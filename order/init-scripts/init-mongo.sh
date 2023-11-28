#!/bin/bash

mongosh -u mongo -p mongo@suLY <<EOF

use order_DB;

db.createUser({
  user: "order_user",
  pwd: "mongo@suLY", // Replace with a secure password
  roles: [{ role: "readWrite", db: "order_DB" }]
});
EOF
