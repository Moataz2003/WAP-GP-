# Wish A Pic - AI Image Generation & Manipulation Platform

## Overview
Wish A Pic is a modern web application built with Angular that provides powerful AI-powered image generation and manipulation capabilities. The platform offers various features including image generation from text prompts, image-to-image transformation, background removal, and logo similarity analysis.

## 🌟 Features

### Core Features
- **Text-to-Image Generation**: Create unique images from textual descriptions
- **Image-to-Image Transformation**: Transform existing images using AI
- **Background Removal**: Automatically remove backgrounds from images
- **Logo Similarity Analysis**: Compare and analyze logo similarities

### User Features
- **User Authentication**: Secure login and registration system
- **History Tracking**: View and manage your generation history
- **Favorites**: Save and organize your favorite generations
- **User Profiles**: Personalized user experience

## 🛠️ Technical Stack

### Frontend
- **Framework**: Angular 17+
- **Styling**: Custom CSS with modern design principles
- **State Management**: Angular services
- **Animations**: Custom Angular animations
- **Routing**: Angular Router with guards

### Backend Integration
- Server-side rendering capabilities
- RESTful API integration
- Interceptors for request/response handling
- Authentication guards

## 📂 Project Structure

```
src/
├── app/
│   ├── animations/      # Custom Angular animations
│   ├── auth/           # Authentication components
│   ├── background-removal/  # Background removal feature
│   ├── favorites/      # Favorites management
│   ├── generate-image/ # Image generation components
│   ├── guards/         # Route guards
│   ├── history/        # History tracking
│   ├── home/           # Home page components
│   ├── interceptors/   # HTTP interceptors
│   ├── login/          # Login components
│   ├── logo-similarity/ # Logo analysis
│   ├── models/         # Data models/interfaces
│   ├── register/       # Registration components
│   ├── sdxl-img2img/   # Image-to-image transformation
│   ├── services/       # Angular services
│   ├── shared/         # Shared components
│   ├── user/           # User profile components
│   └── validators/     # Custom form validators
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd WishAPicAngularApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to:
```
http://localhost:4200
```

## 🔧 Configuration

The application can be configured through various files:

- `angular.json`: Angular workspace configuration
- `environment.ts`: Environment-specific variables
- `app-routing.module.ts`: Route configurations
- `app.module.ts`: Main module configuration

## 🎨 Features in Detail

### Image-to-Image Transformation
- Upload source images
- Apply AI-powered transformations
- Control transformation parameters:
  - Transformation strength
  - Guidance scale
  - Inference steps
- Download or reuse generated images

### Background Removal
- Automatic background detection
- Clean edge processing
- Multiple export options
- Preview capabilities

### Logo Similarity Analysis
- Compare logos for similarities
- Get detailed analysis reports
- Similarity scoring system

### User Management
- Secure authentication
- Profile management
- History tracking
- Favorites system

## 🔐 Security

The application implements several security measures:

- Route guards for protected routes
- HTTP interceptors for request handling
- Secure token management
- Form validators for input validation

## 🌐 Browser Support

The application is optimized for modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop devices
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Angular team for the fantastic framework
- Contributors and maintainers
- Open source community

## 📞 Support

For support, please:
- Open an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ using Angular
