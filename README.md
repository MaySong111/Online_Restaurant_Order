# 🍽️ Restaurant Ordering System

A full-stack web application that allows customers to browse menus, place orders online, and track order status. Restaurant admins can manage menu items, view all orders, and update order statuses.

🔗 **Live Demo**: [online-restaurant.azurewebsites.net](https://online-restaurant.azurewebsites.net/)

> **Test Accounts**
>
> Customer: `test1@test1.com` / `Test1@test1.com` or You can register a new account as a customer
>
> Admin: `Admin1@admin.com` / `Admin1@admin.com`

---

## Features

### Customer
- Register and login with JWT authentication
- Browse menu with category filtering (All / Appetizer / Entrée / Dessert) and sorting
- Search menu items
- Like and unlike menu items (toggle)
- Rate menu items (only available after purchase)
- Add items to cart and adjust quantities
- Place orders
- View personal order history
- View order details (items, total, customer info)
- Track order status: `Confirmed` → `Ready for Pickup` → `Completed`
- Cancel orders
- Edit profile (name, phone, address, avatar) — email is immutable after registration
- Submit button is disabled when no changes are detected, preventing unnecessary API calls

### Admin
- Manage menu items (create, edit, delete, upload image)
- View all customer orders with filter, sort, and search
- Update order status
- Manage user accounts (edit, delete)
- Role-based navigation — admin and customer see different menus after login

---

## Tech Stack

### Frontend
|Technology|Purpose|
|---|---|
| React | UI framework |
| Zustand | Global state (auth, shopping cart) |
| TanStack Query | Server state caching and data fetching |
| React Router | Client-side routing |

> TanStack Query was chosen to avoid redundant API calls by caching server responses. For example, menu items are fetched once and reused across components until explicitly invalidated after a mutation.

### Backend
|Technology|Purpose|
|---|---|
| ASP.NET Core | REST API |
| Entity Framework Core | ORM and database migrations |
| ASP.NET Identity | User management and role management |
| AutoMapper | DTO ↔ Model mapping |
| JWT | Authentication and authorization |

### Infrastructure
|Technology|Purpose|
|---|---|
| Azure SQL Server | Production database |
| Azure App Service | Hosting |
| GitHub Actions | CI/CD pipeline |
| wwwroot (static files) | Image storage |

> Static file storage was chosen over Cloudinary because a restaurant menu has a small, infrequently updated set of images. A CDN service would add unnecessary complexity for this use case.

---

## Architecture

### Backend Structure

```
Presentation Layer
│
├── Controllers
│   ├── AuthController.cs
│   ├── MenuItemController.cs
│   ├── OrderController.cs
│   └── ReviewController.cs
│
Application / Core Layer
│
├── core
│   ├── AutomapperConfig        → Object mapping configuration
│   ├── DbData                  → DbContext & database setup
│   ├── Dtos                    → Request / Response models
│   ├── Models                  → Domain entities
│   ├── Services
│   │     ├── FileService.cs
│   │     └── GenerateJwtTokenService.cs
│   └── Utility
│         ├── StaticOrderStatus.cs
│         └── StaticRoles.cs
│
Infrastructure Layer
│
├── Migrations                  → Database schema history
├── wwwroot                     → Static file storage (images)
```

### Frontend Three-Layer Pattern

| Layer | Responsibility | Error Handling |
|---|---|---|
| API layer (`apiClient`) | Send requests, return data | Throw errors only |
| Hook layer (TanStack Query) | Call API, manage cache and invalidation | Log or update query cache |
| Component layer | Handle user interactions | Show UI feedback (toast, alert) |

### Authentication Design

JWT token is stored in a **Cookie only**. Zustand stores the decoded user info (name, role, email, etc.) — not the token itself. This avoids exposing the token across multiple storage locations in the app.

```
Login → JWT stored in Cookie → decoded payload stored in Zustand
Page refresh → read Cookie → decode → restore Zustand state
Logout → clear Cookie + clear Zustand state + clear cart
```

---

## Database Design

### Entity Relationships
```
ApplicationUser  1──N  Order
Order            1──N  OrderItem
MenuItem         1──N  OrderItem
OrderItem        1──01 Review
ApplicationUser  N──N  MenuItem  (via UserLike)
```

### Design Decisions

**OrderItem stores ItemName and Price as snapshots**

At the time of ordering, the item name and price are copied directly into OrderItem. If the MenuItem is later modified or deleted, the order history still reflects the original values at the time of purchase.

**Review links to OrderItem, not MenuItem**

This ensures only customers who actually purchased an item can leave a review. The average rating displayed on a MenuItem is calculated from all Reviews linked via OrderItem.

**UserLike prevents duplicate likes**

Each like is stored as a UserLike record containing UserId and MenuItemId. Before adding a new like, the backend checks if this combination already exists. If it does, the like is removed (toggle behaviour). This prevents any user from liking the same item more than once.

**MenuItem stores LikesCount and AverageRating as denormalized fields**

Rather than counting likes and calculating average rating on every menu query, these values are stored directly on MenuItem and updated whenever a like or review is submitted. This improves read performance at the cost of slightly more complex write logic.

---


## Deployment

Deployed on **Azure App Service**. CI/CD is configured via **GitHub Actions** — every push to the `main` branch automatically triggers a build and deployment to Azure.

---

## Running Locally

The production build connects to Azure SQL Server. To run locally, configure your own database connection string.

1. Clone the repository
2. Copy `appsettings.sample.json` to `appsettings.json` and fill in your connection string and JWT secret
3. Run database migrations: `dotnet ef database update`
4. Start the backend: `dotnet run`
5. Install frontend dependencies: `npm install`
6. Start the frontend: `npm run dev`
7. If you wanna testing the backend APIs. Open your browser and go to: `http://localhost:5030/swagger`

---

## Design Decisions

### One-time Checkout vs Shopping Cart Pattern

This project uses a **one-time checkout model** — no `Basket` or `BasketItem` entity. The user selects items and submits a single order, which maps directly to `Order` + `OrderItems` on the backend.

A shopping cart pattern (with a persistent Basket entity in the database) would be more suitable when users need to save their cart across sessions or devices. For a simple restaurant ordering scenario with a small menu, the one-time checkout model is simpler and sufficient.

| | One-time Checkout (this project) | Shopping Cart Pattern |
|---|---|---|
| Intermediate state | None (frontend only) | Basket / BasketItem in DB |
| Cart persistence | localStorage | Database |
| Suitable for | Simple menus, quick ordering | E-commerce, frequent modifications |

---

## Future Improvements

- **Payment integration** — integrate a payment gateway (e.g. Stripe); currently orders are placed without a payment step
- **Order status permission** — restrict `Ready for Pickup` and `Completed` to Admin only; currently both roles can update any status
- **Refresh token** — implement refresh token rotation for better session management; currently JWT has a fixed expiry with no renewal
- **httpOnly Cookie** — move to a server-set httpOnly Cookie to prevent XSS access to the token; currently the Cookie is set client-side and remains accessible to JavaScript
- **Database-level unique constraint on UserLike** — add a composite unique index on `(UserId, MenuItemId)` as a second layer of protection in addition to the existing backend logic check
- **Shopping cart per user account** — current localStorage cart is browser-based, not account-based; switching accounts on the same device can cause cart data carry-over (mitigated by clearing cart on logout)
