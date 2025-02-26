# Ramzillow - Real Estate Marketplace

#### A modern real estate platform where users can browse, buy, sell, and rent properties.

<img src="./public/Screenshot1.png" alt="Screenshot of Ramzillow" style="width:49%;"/>

<img src="./public/Screenshot2.png" alt="Screenshot of Ramzillow" style="width:49%;"/>

## Description

Ramzillow is a **full-stack real estate platform** where users can **search for properties, list their own properties, and manage their listings**. The application supports **property filtering, secure authentication, image uploads via Cloudinary, and an intuitive dashboard** for managing posts.

## Table of Contents

- [Technologies Used](#technologiesused)
- [Features](#features)
- [Wireframe & Design](#design)
- [ERD & DB Structure](#erd)
- [Project Next Steps](#nextsteps)
- [Deployed App](#deployment)
- [About the Author](#author)

## <a name="technologiesused"></a>Technologies Used

### Frontend:

- React.js
- React Router
- Context API
- HTML/CSS

### Backend:

- Node.js
- Express.js
- MongoDB & Mongoose
- Cloudinary (for image storage)
- JWT Authentication
- Bcrypt for password hashing

### Other Tools:

- Axios (for API calls)
- Vite (React setup)
- Dotenv (for environment variables)

## <a name="features"></a>Features

### ✅ Users can:

✔ **Search for properties** using filters such as location, price range, bedrooms, and type.  
✔ **List their own properties** for sale or rent, with image uploads.  
✔ **Edit or delete their own listings** from the **dashboard**.  
✔ **Secure login and registration** with JWT authentication.  
✔ **Save favorite properties** for later (future feature).  
✔ **View property details** on a separate page.

## <a name="design"></a>Wireframe & Design

- **Inspiration:** Modern real estate platforms like Zillow and Redfin.
- **Design:** Clean and professional, using **Poppins font** for typography and a **blue, gray, and gold color palette**.

## <a name="erd"></a>ERD & Database Structure

**Entity Relationship Diagram (ERD)**

- The **User** model stores account details and references property listings.
- The **Post** model stores property details with indexes for fast querying.

<img src="./src/assets/diagram.png" alt="ERD Diagram for Ramzillow"/>

## <a name="nextsteps"></a>Project Next Steps

### 🚀 Upcoming Features:

- ✅ **Favorite Listings**: Users can save properties for later.
- ✅ **User Messaging System**: Direct contact between buyers and sellers.
- ✅ **Payment Integration**: Add Stripe for online deposits and payments.
- ✅ **Google Maps API**: Display property locations on an interactive map.
- ✅ **Admin Panel**: Moderation tools for managing listings and users.

## <a name="deployment"></a>Deployed Link

🔗 **Live Site:** [Ramzillow](https://ramzillow.com)  
🔗 **GitHub Repository - Frontend:** [GitHub Repo](https://github.com/ramzikarkoub/React---Real-Estate-App)  
🔗 **GitHub Repository - Backend:** [GitHub Repo](https://github.com/ramzikarkoub/Real-Estate---Node-Express-MongoDB)

## <a name="author"></a>About The Author

I am a **full-stack developer** passionate about creating practical and impactful web applications. **Ramzillow** is my attempt at revolutionizing real estate with a modern, user-friendly interface and powerful backend technology.

🔗 [LinkedIn](https://www.linkedin.com/in/ramzikarkoub/)  
🔗 [Portfolio](https://www.ramzikarkoub.com/)

## Special Mention: Supporters of the Build

- **Developer:** [Ramzi Karkoub](https://www.linkedin.com/in/ramzikarkoub/)
