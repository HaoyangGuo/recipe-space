# [recipe-space.dhguo.dev](https://recipe-space.dhguo.dev)

# Recipe Space

Recipe Space is a tool enabling users to discover recipes based on available ingredients and share their culinary creations.

![Main screenshot or GIF](/assets/recipe-space-demo.gif)

## Table of Contents

- [recipe-space.dhguo.dev](#recipe-spacedhguodev)
- [Recipe Space](#recipe-space)
  - [Table of Contents](#table-of-contents)
  - [Screenshots](#screenshots)
    - [Search by ingredients or by name](#search-by-ingredients-or-by-name)
    - [Share your culinary creations](#share-your-culinary-creations)
    - [Find recipes from various cuisines](#find-recipes-from-various-cuisines)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)


## Screenshots

### Search by ingredients or by name
![Seearch](./public/image/search-screenshot.png)

### Share your culinary creations
![Community](./public/image/feed-screenshot.png)

### Find recipes from various cuisines
![Recipe](./public/image/recipes-screenshot.png)

  
## Features

- **OAuth 2.0**: Ensure secure authentication via NextAuth.
- **Two Search Modes**: Find recipes by ingredients or name.
- **Community Sharing**: Share culinary creations with image uploading, powered by Cloudinary.
- **Client-side Caching**: Minimize API calls to reduce costs.
- **Responsive Design**: Optimized for both desktop and mobile.
- **DB & ORM**: Utilized Prisma with PostgreSQL.


## Tech Stack

- **Frontend**: React, Next.js react-query, Jotai, react-hook-form, TailwindCSS.
- **Backend**: Node.js, Vercel serverless functions, Prisma.
- **Database**: PostgreSQL.
- **Deployment**: Vercel.

## Getting Started

```bash
git clone https://github.com/HaoyangGuo/recipe-space.git
cd recipe-space
npm install

# Populate a .env file with your credentials, follow .env.example

npm run dev
```



