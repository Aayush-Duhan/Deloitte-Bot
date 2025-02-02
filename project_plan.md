# Manufacturing Order Processing Bot

## Project Overview
An automated system for processing purchase orders received via email for a manufacturing company. The system automates order creation, verification, and customer communication.

## Tech Stack

### Backend
1. **Core**
   - Node.js
   - Express.js
   - Nodemon (development server)

2. **Database**
   - MongoDB
   - Mongoose (ODM)

3. **Authentication & Security**
   - JWT (JSON Web Tokens)
   - Bcrypt (password hashing)
   - OTP-based verification

4. **Email & Document Processing**
   - Gmail API
   - Nodemailer
   - OAuth2 integration

5. **Utilities**
   - Cors
   - Dotenv
   - Express Validator
   - Logging

### Frontend
1. **Core**
   - React 18+ (Vite)
   - JavaScript (ES6+)

2. **Styling**
   - Tailwind CSS
   - Custom animations
   - Backdrop blur effects

3. **State Management**
   - React Context API
   - Local Storage for auth

4. **Routing**
   - React Router v6
   - Protected Routes

5. **HTTP Client**
   - Axios

6. **UI Components**
   - Custom components
   - Responsive design
   - Dark theme

## Implementation Phases

### Phase 1: Authentication & User Management ✓
1. **Backend**
   - Express.js project structure ✓
   - MongoDB connection and configuration ✓
   - User/Company registration with OTP ✓
   - JWT implementation ✓
   - Email verification system ✓

2. **Frontend**
   - Vite + React setup ✓
   - Authentication pages (Login/Register) ✓
   - OTP verification ✓
   - Protected route setup ✓
   - Basic dashboard layout ✓

### Phase 2: Email Integration & Processing
1. **Backend**
   - Gmail API integration
   - Email monitoring system
   - Email parser for different formats
   - Document extraction
   - Store extracted data in MongoDB

2. **Frontend**
   - Email configuration settings
   - Email monitoring dashboard
   - Error notifications
   - Real-time updates

### Phase 3: Order Management
1. **Backend**
   - Order processing pipeline
   - Duplicate order detection
   - Order validation system
   - Automated acknowledgment emails
   - Error handling and logging

2. **Frontend**
   - Order dashboard
   - Order details view
   - Order status tracking
   - Error log viewer
   - Real-time order updates

### Phase 4: Customer Communication
1. **Backend**
   - Email template system
   - Customer notification system
   - Automated response system
   - Communication logging

2. **Frontend**
   - Template management interface
   - Communication logs
   - Customer management dashboard
   - Notification preferences

### Phase 5: Analytics & Reporting
1. **Backend**
   - Analytics endpoints
   - Report generation
   - Data export functionality
   - Performance metrics

2. **Frontend**
   - Analytics dashboard
   - Interactive charts
   - Report generation interface
   - Export functionality

## Key Features by Phase

### Phase 1 ✓
- Company registration with email verification ✓
- OTP-based authentication ✓
- Secure login system ✓
- Role-based access control ✓
- Basic dashboard setup ✓

### Phase 2
- Gmail API integration
- Automated email monitoring
- Support for multiple document formats
- Real-time monitoring dashboard
- Error handling and notifications

### Phase 3
- Intelligent order extraction
- Duplicate detection
- Validation rules
- Status tracking
- Real-time updates

### Phase 4
- Customizable email templates
- Automated responses
- Communication history
- Customer notifications

### Phase 5
- Order analytics
- Processing time metrics
- Error rate tracking
- Exportable reports
- Performance dashboards

## Security Features
- JWT-based authentication
- OTP verification
- Password hashing with bcrypt
- Protected routes
- MongoDB security best practices
- CORS configuration
- Environment variable protection
