################################ HOW TO RUN CONTAINERS #################################

################### initiate mongo ####################
docker build -t mongo -f Dockerfile.mongo .
docker run --name mongo -d --network ecommerce_network --ip 192.168.2.5 -p 27017:27017 mongo
docker exec -it mongo /bin/sh 
mongosh
use ec_DB
db.createUser({
  user: "ec_User",
  pwd: "mongo@suLY", // Replace with a secure password
  roles: [{ role: "dbOwner", db: "ec_DB" }]
})

##############initiate ecommerce app####################
docker build -t ecommerce_app -f Dockerfile.app.
docker run -d --name api --network ecommerce_network --ip 192.168.2.10 ecommerce


############# initiate nginx ###########################

docker build -t nginx -f Dockerfile.nginx .
docker run --restart always -d --name nginx --network ecommerce_network --ip 192.168.2.4 -p 3000:80 nginx
