# Video Processing Platform - YouTube Clone

## 🎯 Project Overview

A modern video processing platform built with Google Cloud services, implementing core video sharing functionalities similar to YouTube. This project showcases a scalable, event-driven architecture using cloud-native technologies.

## ⚙️ System Architecture

The platform is built on a microservices architecture utilizing various Google Cloud services:

### Core Components

1. **Video Upload Flow**
   - Users upload videos to Google Cloud Storage
   - Upload events trigger Pub/Sub messages
   - Cloud Run workers process videos using FFmpeg
   - Processed videos stored back in Cloud Storage

2. **Authentication & Data Storage**
   - Firebase Authentication for Google Sign-In
   - Firestore for video metadata and user data
   - Firebase Functions for API endpoints

3. **Web Interface**
   - Next.js frontend hosted on Cloud Run
   - TypeScript for type safety
   - Server-side rendering for performance

## 🚀 Key Features

- **User Authentication**
  - Google account integration
  - Secure sign-in/sign-out flow

- **Video Management**
  - Secure video upload using signed URLs
  - Automatic video transcoding (360p, 720p)
  - Asynchronous video processing

- **Scalable Processing**
  - Event-driven architecture using Pub/Sub
  - Automatic scaling with Cloud Run
  - Durable message queuing

## 💻 Technology Stack

### Frontend
- Next.js with TypeScript
- Firebase SDK
- Google Cloud Storage integration

### Backend
- Express.js
- FFmpeg for video processing
- Firebase Functions
- Docker containers

### Cloud Services
- Google Cloud Storage
- Cloud Pub/Sub
- Cloud Run
- Firebase Authentication
- Firestore
- Firebase Functions

## 🔧 Setup & Installation

1. **Prerequisites**
   ```bash
   # Install Node.js and npm
   # Install Docker
   # Setup Google Cloud account
