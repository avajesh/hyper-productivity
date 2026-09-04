# Hyper Productivity Business & Development Strategy

This document outlines the strategic decisions and monetization plans for the Hyper Productivity project, a hard fork of Super Productivity.

## 1. Product & Brand Identity

- **App Name**: Hyper Productivity
- **Goal**: Develop the ultimate productivity and time-tracking app. Eliminate all lingering bugs/issues from the original project and build highly requested features (e.g., Task Hierarchies / nested subtasks).
- **Platform Ecosystem**: Windows, macOS, Linux, Android, iOS, and Web.
- **Primary Hub**: techeia.com/hyper-productivity

## 2. Licensing & Source Code

- **Model**: Open Source (Core).
- **Reasoning**: Keeping the core app open source builds community trust, attracts developers, and ensures rapid user growth.
- **License**: MIT License (carried over from the original project). Future modules or backend sync systems can be dual-licensed or kept closed-source.

## 3. Monetization Strategy

To generate income without relying entirely on direct app sales, we will leverage traffic and ecosystem convenience:

- **AdSense Integration (techeia.com)**:
  - The app is free, but all internal links (Help, Documentation, Release Notes, Templates, Plugins) point back to techeia.com.
  - Since techeia.com is AdSense-approved, the massive user base driven by the free app will generate recurring ad revenue when they visit the site for resources.
- **Web App Hosting (PWA)**:
  - The web version of Hyper Productivity will be hosted directly on techeia.com (e.g., tasks.techeia.com). This ensures users who don't want a desktop app spend hours on the domain, driving ad impressions.
- **Plugin & Template Marketplace**:
  - Host a community directory on techeia.com where users can download JSON templates, themes, and plugins for Hyper Productivity.
- **Paid App Stores (Future)**:
  - Publish the compiled apps on the Microsoft Store, Apple App Store, and Google Play Store for a one-time fee (e.g., $9.99). Many users prefer the convenience of the official store over manual GitHub downloads.

## 4. Immediate Development Roadmap

1.  **Rebranding & Configuration (Completed)**: Rename app, package correctly for Windows, fix build pipeline.
2.  **App Routing**: Redirect all internal app URLs (Donate, Help, Sync Setup, GitHub links) to techeia.com to capture traffic.
3.  **Feature**: Implement Task Hierarchies (Sub-tasks within sub-tasks).
4.  **Stability**: Fix critical data loss / sync bugs (#4616, #5252, #4544) to guarantee absolute reliability.
5.  **Web Deployment**: Deploy the Progressive Web App to the local C:\Data\Projects\techeia.com repository so it can be hosted live.
