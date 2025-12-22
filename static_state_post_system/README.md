# Static State Post System (SSPS)

A lightweight blog generation and management system that allows users to create, manage, and publish static blog content in a local development environment.

## Overview

Static State Post System (SSPS) is designed for developers who want to create blogs using a local development environment with Next.js + React for the frontend, while implementing content management features with various backend languages. The system ultimately generates static pages that can be deployed to GitHub.

## Key Features

### Local Development Environment
- Lightweight local environment with minimal dependencies
- Simultaneous frontend and backend visibility during local development
- Local environment simulates online server behavior with no environment discrepancies

### Multi-language Backend Support
- Default backends: Python (Django), Go (Gin), and C# (ASP.NET Core)
- Clear API interfaces supporting integration with other backend languages
- Backend management system for content management (posts, pages, categories, etc.)

### Static Blog Generation
- Automatically generates static HTML pages through the backend management system
- Markdown format support for content creation
- Image and attachment resource management
- Complete static file structure ready for GitHub Pages deployment

### GitHub Deployment
- Command-line tool for one-click upload to GitHub
- GitHub Pages automatic deployment support
- Direct upload of generated static files to GitHub repositories

## Technical Requirements

### Frontend
- Built with Next.js 14+
- React 18+ with TypeScript support
- Styled with Tailwind CSS
- Real-time preview functionality

### Backend
- RESTful API design
- JWT authentication support
- Data storage: SQLite (local development) with expandability to other databases

### Local Environment
- Minimal dependencies (Node.js and optionally Python)
- Docker Compose support for easy environment setup
- No need for additional databases or complex services
- Simple installation with zero complex configuration

## Product Vision

SSPS aims to provide users with a simple, lightweight, and versatile blog publishing platform that lets them focus on content creation without worrying about complex backend architectures or deployment processes. By combining local development environments with GitHub static page hosting, SSPS delivers an optimal blogging experience while maintaining the high performance and security of static websites.