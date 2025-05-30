# Web TODO Extension

A Chrome extension that helps you organize web pages as TODOs with different priority levels.

## Features

- Save web pages as TODOs with priority levels (P1, P2, P3)
- Organize TODOs in priority-based tabs
- Display website favicons and titles
- Quick access to saved pages
- Local storage for persistence
- Delete TODOs when completed
- Edit priority levels via hover menu

![Extension Interface](screenshot1.png)

## How to Use

1. Click on the extension icon in your Chrome browser
2. Select a priority level (P1, P2, or P3)
3. Click "Save" to add the current page as a TODO
4. Switch between priority tabs to view your TODOs
5. Click on a TODO to open the page in a new tab
6. Hover over a TODO to reveal priority editing and delete options

## Technical Details

- Uses Chrome Storage API for data persistence
- Implements tab-based interface for priority management
- Fetches favicons using Google's favicon service
- Automatically extracts page titles and URLs
- Real-time counter for TODOs in each priority level

## Development

This extension is built using vanilla JavaScript and Chrome Extension APIs. The main components are:

- `popup.js`: Handles the main logic for TODO management
- Chrome Storage API: Stores TODOs locally
- Chrome Tabs API: Retrieves current tab information

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory
