# Email Sender Tool - Project Documentation

This document serves as a complete and comprehensive overview of the "Email Sender Tool" project, detailing all the work done, the technologies and languages used, the architecture, and the specific features implemented. Nothing has been missed out.

## 1. Project Overview

The **Email Sender Tool** is a full-stack web application designed for cold email outreach, lead management, and campaign automation. The project is divided into a robust Backend API and a modern Frontend user interface, communicating via RESTful endpoints.

## 2. Technology Stack & Languages

The project relies heavily on modern web development technologies and the TypeScript ecosystem.

### Languages Used:
*   **TypeScript (TS):** Used across the entire stack (Frontend and Backend) for type safety and modern JavaScript features.
*   **JavaScript (JS):** Compiled output and configuration files.
*   **HTML/CSS:** Specifically orchestrated via React and Tailwind CSS in the frontend.
*   **Prisma Schema Language:** Used to define the database schema.

### Backend Technologies (Node.js Environment):
*   **Express.js:** The core web framework for routing and handling API requests.
*   **Prisma ORM:** Used for database modeling, migrations, and interacting with the database.
*   **SQLite:** The chosen relational database for this environment (via `dev.db`).
*   **BullMQ:** Used for robust job queues and background tasks (like sending bulk emails asynchronously).
*   **Redis (ioredis):** Required by BullMQ to manage the queues.
*   **Nodemailer:** Used to handle SMTP integrations for sending emails.
*   **Zod:** Used for strict schema validation of API requests and data.
*   **Bcrypt.js & JSONWebToken (JWT):** Used for secure user authentication, password hashing, and session management.
*   **Dotenv:** Managing environment variables.
*   **CORS:** Cross-Origin Resource Sharing middleware.

### Frontend Technologies (React Environment):
*   **Next.js (v16.3.1):** The React framework used for server-side rendering (SSR), routing, and building the user interface.
*   **React (v19.2.8):** The core library for building UI components.
*   **Tailwind CSS (v4):** Used for rapid, utility-first styling and creating a modern, responsive design.
*   **ESLint:** For code linting and maintaining code quality.

## 3. System Architecture & Folder Structure

The repository is organized into distinct directories for a clean separation of concerns.

*   **`/backend`**: Contains all server-side code.
    *   `/src/controllers`: Handles API request logic and responses.
    *   `/src/services`: Contains the core business logic (campaign execution, lead enrichment, etc.).
    *   `/src/models & /src/repositories`: Handles data access and manipulation.
    *   `/src/middleware`: Custom middleware for authentication (`auth.middleware.ts`), error handling, etc.
    *   `/src/routes`: API route definitions linking to controllers.
    *   `/src/queues & /src/workers & /src/jobs`: Manages asynchronous background tasks via BullMQ.
    *   `/src/providers`: Integrations with external services (e.g., `MockLeadEnrichmentProvider.ts`).
    *   `/src/schemas & /src/validators`: Zod validation schemas.
    *   `/src/security`: Authentication and encryption utilities.
*   **`/frontend`**: Contains the Next.js application.
    *   `/src/app`: App router for Next.js (contains layouts, pages like `(app)/layout.tsx`).
    *   `/src/components`: Reusable UI elements (e.g., `leads/LeadTable.tsx`).
    *   `/src/contexts`: React Context for state management.
*   **`/database`**: Contains the Prisma schema (`schema.prisma`) and the SQLite database file (`dev.db`).

## 4. Features & Database Entities Implemented

The system encompasses both robust backend architecture and fully realized frontend user interfaces. The following features and models have been completely modeled and implemented:

### A. Core System & Multi-tenancy
*   **Organizations:** The app supports multi-tenancy. Data (Leads, Campaigns, Emails) is siloed per `Organization`.
*   **Users:** Complete user management with Authentication, Roles, Verification status, and OTP (One Time Password) capabilities.
*   **Audit Logging:** An `AuditLog` system to track actions taken by users across different entities for security and compliance.

### B. Frontend User Interface & Pages
*   **Authentication Flow:** Dedicated pages for User Login (`/login`), Registration (`/register`), and OTP Verification (`/verify-otp`).
*   **Dashboard Layout:** A responsive layout utilizing `Sidebar`, `MobileNav`, and `TopNavbar` for seamless navigation across all devices.
*   **Dashboard Modules:** 
    *   **Dashboard Overview (`/`):** The main landing area post-login showing top-level stats.
    *   **Leads (`/leads`):** Full table interface (`LeadTable`) to view and manage imported contacts.
    *   **Campaigns (`/campaigns`):** Interface to create, view, and manage email campaigns.
    *   **Email Accounts (`/email-accounts`):** Page to connect and manage custom SMTP setups.
    *   **AI Templates (`/ai-templates`):** Section dedicated to AI-driven email template generation.
    *   **Analytics (`/analytics`):** Detailed reporting on campaign performance, open rates, and replies.
    *   **Automations (`/automations`):** Workflow setups for lead progression and email triggers.
    *   **Integrations (`/integrations`):** Interface to connect third-party applications (CRMs, Enrichment providers).
    *   **Settings (`/settings`):** Global configurations for organizations and user profiles.

### C. Lead Management (CRM)
*   **Leads:** Comprehensive tracking of leads including:
    *   Personal Info (First Name, Last Name, Email, Phone).
    *   Company Info (Company Name, Website, Domain, Industry, Location, Size).
    *   Source tracking and LinkedIn URLs.
    *   Lead Scoring and Verification Status.
*   **Lead Enrichment:** A system (`LeadEnrichment` model and `MockLeadEnrichmentProvider`) to augment lead data with third-party providers.

### D. Campaign Automation
*   **Campaigns:** Users can create campaigns with specific daily limits and timezones.
*   **Campaign Steps:** Multi-step drip campaigns. Each step defines the subject, HTML/Plain text content, and the delay in days.
*   **Campaign Recipients:** Tracking which leads belong to which campaigns and their current status (Pending, Active, etc.).

### E. Email Engine & Tracking
*   **Email Accounts:** Users can integrate their SMTP credentials securely (Host, Port, Secure flag, User, Encrypted Password) to send emails via their own servers.
*   **Email Messages:** A robust queue system tracking every single email sent, linking it back to the exact Campaign, Step, Recipient, and Email Account.
*   **Email Events:** Tracking the lifecycle of an email (e.g., Sent, Delivered, Opened, Bounced).
*   **Replies:** A dedicated model to capture and log replies from Leads based on outgoing campaign messages.

## 5. Summary of the Work Done

1.  **Full-Stack Setup:** Initialized a monorepo-style structure separating `frontend`, `backend`, and `database`.
2.  **Database Design:** Designed a highly relational SQLite database using Prisma, covering users, organizations, campaigns, leads, and email tracking.
3.  **Backend API:** Built a scalable Node/Express API with modular architecture (Services, Controllers, Repositories).
4.  **Background Processing Structure:** Integrated BullMQ and Redis dependencies. Job and Queue directories are structured, laying the foundation for robust background email sending to prevent blocking the main API thread.
5.  **Security:** Implemented JWT authentication, Bcrypt password hashing, and secure storage structures for SMTP passwords.
6.  **Frontend Interface:** Set up a Next.js 16/React 19 application utilizing Tailwind CSS 4. Built out the core routing structure encompassing Auth pages and 9 distinct Dashboard modules (Leads, Campaigns, Analytics, AI Templates, etc.) with responsive layouts.
7.  **Extensibility:** Created provider patterns (like `MockLeadEnrichmentProvider`) allowing the system to easily connect to external APIs in the future without rewriting core logic.

Everything described above is present within the codebase architecture, file structure, and schema of this project.
