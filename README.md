# Vobb OS Atlas - Deal Management Interface

A comprehensive Next.js application for managing sales deals with both tabular and kanban views, built for the Vobb OS Atlas module.

## Features

### 🎯 Core Functionality
- **Dual View Modes**: Toggle between Tabular and Kanban views
- **Deal Management**: Create, view, edit, and delete deals
- **Pipeline Tracking**: 8-stage sales pipeline with visual progress tracking
- **Drag & Drop**: Move deals between stages in Kanban view

### 🔧 Customizable Views
- **Tabular View**: 
  - Toggle column visibility (Client Name, Product Name, Stage, Created Date, Actions)
  - Sortable and filterable data
  - Responsive table design
- **Kanban View**:
  - Toggle metadata visibility on deal cards
  - Visual pipeline stages with deal counts
  - Drag and drop between stages

### 📊 Sales Pipeline Stages
1. Lead Generated
2. Contacted
3. Application Submitted
4. Application Under Review
5. Deal Finalized
6. Payment Confirmed
7. Completed
8. Lost

### 🎨 User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS for a polished look
- **Loading States**: Proper loading indicators and error handling
- **Form Validation**: Client-side validation for deal creation
- **Persistent Preferences**: View preferences saved across sessions

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **Build Tool**: Next.js App Router

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vobb-atlas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx          # Main deals page
│   ├── settings/         # Settings page
│   └── profile/          # Profile page
├── components/           # React components
│   ├── Navbar.tsx       # Navigation component
│   ├── ViewToggle.tsx   # View mode toggle
│   ├── CreateDealModal.tsx # Deal creation modal
│   ├── TabularView.tsx  # Table view component
│   ├── KanbanView.tsx   # Kanban board component
│   └── __tests__/       # Component tests
├── store/               # State management
│   ├── useStore.ts      # Zustand store
│   └── __tests__/       # Store tests
├── services/            # API services
│   ├── api.ts          # Mock API implementation
│   └── __tests__/      # API tests
└── types/              # TypeScript definitions
    └── index.ts        # Type definitions
```

## Usage Guide

### Creating a Deal

1. Click the **"Create Deal"** button in the top right
2. Fill in the required fields:
   - **Product**: Select from available products
   - **Client**: Select from available clients
   - **Initial Stage**: Choose starting pipeline stage
   - **Notes**: Add optional notes
3. Click **"Create Deal"** to save

### Managing Deals

#### Tabular View
- View all deals in a sortable table
- Use the **"Columns"** button to toggle column visibility
- Click the edit icon to view/edit deal details
- Click the delete icon to remove deals

#### Kanban View
- View deals organized by pipeline stage
- Drag and drop deals between stages
- Use the **"Metadata"** button to toggle card information
- Each stage shows the count of deals

### Customizing Views

- **View Toggle**: Switch between Tabular and Kanban views
- **Column Preferences**: Hide/show table columns as needed
- **Metadata Preferences**: Control what information shows on kanban cards
- **Preferences Persist**: Your choices are saved across browser sessions

## Testing

The application includes comprehensive testing:

### Unit Tests
- Component rendering and interactions
- Store state management
- API service functionality

### Integration Tests
- User workflows and form submissions
- Data persistence and updates
- Error handling scenarios

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## API Integration

The application currently uses a mock API service that simulates:
- Deal CRUD operations
- Product and client data
- Network delays and error scenarios

To integrate with a real backend:
1. Replace the mock API calls in `src/services/api.ts`
2. Update the data models to match your backend schema
3. Implement proper error handling for network requests

## State Management

The application uses Zustand for state management with:
- **Global State**: Deals, products, clients, UI preferences
- **Persistence**: View preferences saved to localStorage
- **Actions**: CRUD operations, view toggles, preference updates
- **Reactivity**: Components automatically update when state changes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Notes

### Key Design Decisions
- **Component Architecture**: Modular, reusable components with clear separation of concerns
- **State Management**: Centralized state with Zustand for predictable data flow
- **Type Safety**: Full TypeScript implementation for better development experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS utilities

### Performance Considerations
- **Lazy Loading**: Components load only when needed
- **Optimized Rendering**: React.memo and useMemo for expensive operations
- **Efficient State Updates**: Immutable state updates with Zustand

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ for Vobb OS**
