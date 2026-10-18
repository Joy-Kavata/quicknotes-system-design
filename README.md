# QuickNotes System Design & API Client

## Project Description
QuickNotes is a full-stack transition project demonstrating both a functional browser-based API client interacting with asynchronous REST endpoints and comprehensive backend system design documentation for scaling a note-taking application to 1 million users.

## How to Run the API Client
1. Clone this repository to your local machine:
   ```bash
   git clone [https://github.com/Joy-Kavata/quicknotes-system-design.git](https://github.com/Joy-Kavata/quicknotes-system-design.git)

   Open the project folder in VS Code.

Install and open the Live Server extension in VS Code.

Right-click index.html and select "Open with Live Server" to test loading, creating, and deleting notes in your browser.

## System Design Documents
API Design Specification

Data Model Specification

Architecture & Scaling Plan

## What I Learned
Asynchronous JavaScript & Fetch API: Managing multi-state UI workflows (loading, success, error, and empty states) while handling HTTP requests robustly with try/catch.

Secure DOM Manipulation: Protecting web apps against XSS vulnerabilities by rendering user-generated text exclusively through textContent instead of raw innerHTML.

Enterprise System Architecture: Designing high-availability backend systems complete with capacity planning equations, database normalization, read replicas, and caching strategies.