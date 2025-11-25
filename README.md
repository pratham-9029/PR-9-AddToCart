# Add to Cart Feature with Full CRUD Operations

This is a complete add-to-cart implementation with full CRUD operations for both products and cart items, with separate files for HTML, CSS, and JavaScript.

## Features

### Product Management (CRUD)
- **Create**: Add new products with name, price, and emoji
- **Read**: Display all products in a grid layout
- **Update**: Edit existing product details
- **Delete**: Remove products from the inventory

### Cart Operations (CRUD)
- **Create**: Add products to cart
- **Read**: View cart items with quantities
- **Update**: Increase/decrease item quantities
- **Delete**: Remove items from cart

### Additional Features
- Real-time cart count indicator
- Cart summary with item count and total price
- Clear entire cart
- Checkout functionality
- Responsive design
- Visual notifications

## File Structure

- [index.html](file://c:\Users\RAMDEV\Desktop\PRATHAM\PR-9-AddToCart\index.html) - Main HTML structure
- `styles.css` - All styling
- [script.js](file://c:\Users\RAMDEV\Desktop\PRATHAM\PR-9-AddToCart\script.js) - JavaScript functionality
- `README.md` - This file

## How to Use

### Managing Products
1. Use the "Manage Products" form to add new products
2. Enter product name, price, and optionally an emoji
3. Click "Save Product" to add to inventory
4. Use the pencil icon to edit existing products
5. Use the X icon to delete products

### Using the Cart
1. Browse products
2. Click "Add to Cart" on any product
3. View your cart in the cart section
4. Adjust quantities using +/- buttons
5. Remove individual items with the "Remove" button
6. Use "Clear Cart" to empty the cart
7. Use "Checkout" to complete your purchase

## Implementation Details

### HTML Structure
- Header with cart icon and count
- Product management form
- Products section with grid layout
- Cart section with items list and summary

### CSS Features
- Responsive grid layout for products
- Form styling for product management
- Hover effects and transitions
- Clean, modern design
- Mobile-friendly layout

### JavaScript Functionality
- Product data management with full CRUD
- Cart state management with full CRUD
- Event handling for all interactions
- Dynamic DOM updates
- Notification system
- Form validation

## Customization

To customize styling:
1. Modify `styles.css` as needed
2. Adjust colors, fonts, spacing, etc.

To extend functionality:
1. Add more fields to the product form
2. Implement data persistence (localStorage, database, etc.)
3. Add product categories or filtering
4. Enhance the checkout process