const axios = require("axios");

exports.axiosRequest =async  (method, url, token) => 
await axios({
 method,
 url,
 headers: {
   Authorization: `Bearer ${token}`,
   "Content-Type": "application/json",
 },
});


//   const response = await axios({
//     method: "get",
//     url: `${process.env.authService}/api/v1/users/${this.decoded.userId}`,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   this.role = response.data.data.role;
//   next();
// } catch (err) {
//   console.log(err.response.data.message, err.response.data.status);
//   next(new ApiError(err.response.data.message, err.response.status));
// }
// });
