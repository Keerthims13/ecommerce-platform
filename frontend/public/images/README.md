# Image Assets Guide

This folder contains all image assets for the ShopEase ecommerce platform.

## Folder Structure

### `/products`
- Store all product images here
- Recommended size: 300x300px or 600x600px
- Supported formats: JPG, PNG, WebP
- Naming convention: `product-{id}.jpg` or `{product-name}.jpg`

### `/categories`
- Store category icons/images here
- Recommended size: 200x200px or 400x400px
- Supported formats: PNG, SVG
- Files: electronics.png, fashion.png, books.png, accessories.png

### `/banners`
- Store banner images for homepage
- Recommended sizes:
  - Desktop: 1200x400px
  - Mobile: 600x300px
  - Hero: 1400x600px
- Supported formats: JPG, PNG, WebP

## Adding Images

1. **Local Storage**: Upload image files directly to the appropriate folder
2. **Usage in Code**:
   ```javascript
   // Local image
   <img src="/images/products/product-1.jpg" alt="Product" />
   
   // Or in material-ui
   <CardMedia
     component="img"
     image="/images/products/product-1.jpg"
     alt="Product Name"
   />
   ```

## Using Placeholder Images

Currently, the app uses placeholder images from `https://via.placeholder.com/`. 

To replace with local images:
- Add your images to the appropriate folders
- Update image paths in components

Example:
```javascript
// Before (placeholder)
image: "https://via.placeholder.com/300x300?text=Product"

// After (local)
image: "/images/products/product-1.jpg"
```

## Image Optimization Tips

1. Compress images before uploading
2. Use WebP format for better performance
3. Provide multiple sizes for responsive design
4. Use lazy loading for product images
5. Add alt text for accessibility

## Tools for Image Compression

- TinyPNG: https://tinypng.com/
- ImageOptim: https://imageoptim.com/
- Squoosh: https://squoosh.app/
