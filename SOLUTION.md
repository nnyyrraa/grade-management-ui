# ✅ SOLUTION.md – Design Decisions & Architecture

## 🎯 Project Goals
- Build a responsive, intuitive UI for managing class grades
- Ensure type safety and component modularity
- Provide real-time feedback with autosave functionality

## 📐 Architecture Overview
- **App Router**: All pages are managed using Next.js App Router inside `src/app/`
- **State Management**: Local state managed using `useState`, persisted via `localStorage` for simplicity and offline capability
- **Component Structure**:
  - Modular pages: `Dashboard`, `Grades Configuration`, `Grades Input`, and `Grades Preview`
  - Shared components in `components/` directory for reusability (e.g., dropdowns, tables, export buttons)
- **Mock Data Handling**: `mockClasses.ts` and `mockMahasiswa.ts` simulate API-like behavior

## 🧩 Design Decisions
- **Tailwind + MUI**: Tailwind for layout, MUI selectively for form controls and dropdowns.
- **Chart.js**: Used for bar charts due to its simplicity and interactivity
- **LocalStorage**: Chosen for prototyping to persist user data per class
- **File Export**: Used `xlsx` for exporting to `.csv` and `.xlsx` to satisfy evaluation criteria.

## 🧠 Improvements
- Add authentication & backend API
- Role-based access control (admin/dosen)
- Import student data from template
- Error boundary with detailed user-friendly messages
