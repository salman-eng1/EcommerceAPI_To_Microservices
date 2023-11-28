#!/bin/bash

mongosh -u mongo -p mongo@suLY <<EOF

use coupon_DB;

db.createUser({
  user: "coupon_user",
  pwd: "mongo@suLY", // Replace with a secure password
  roles: [{ role: "readWrite", db: "coupon_DB" }]
});
EOF
