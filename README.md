## **IdividualBuild.MGIS**

### Fitness Companion - FitCraft
allows users to select from a database of workouts organized by category, select preset workout plans, or build their own
feed gemini a list of workouts that it can compile and organize into a range of categroies(plyometric, mobility, compund movement etc)
Uses vite and react to run 

### Project Goals
The goal of the app is to help users make more informed decisions about their workouts by idenitfying the muscle groups involved, and categorizing workouts in their respective movment categories 

## Ideas/Improvements
Focus tab: intended for users who already know their bodies physical limitations whether from injury, sorness, or lack of training and want help making informed exercise selections during recovery and long term conditioning

Update display-experiemnt with different ambiance for the app

## Current Direction
getting the existing application fully functional before expanding scope
remove calorie tracker, the app uses unreliable calculation which we're better off without

## Summary of Key Features:
Secondary Category Matching: Exercises display dynamically under all relevant categories (e.g., Squat Jumps under Lower Body, Plyometric, and Home Workout).

Guided Exercise Progression: Step-by-step set tracker with visual progress bar across the entire routine.

Live Counter Badges: Every category tab chip displays a real-time counter showing how many options are available without needing to open the tab.

Instant Search: Real-time filtering by exercise name or target muscle group.

Live Workout Player with automated work/rest timers and Web Audio API beepers.

Fully Offline & Self-Contained: Hardcoded exercise seed database (INITIAL_EXERCISES) operating completely offline without requiring external AI APIs.

    Clear Equipment Warnings: Visual badge indicators on every exercise card:

    Green Badge ("🏠 Bodyweight / No Gear Needed") for zero-equipment movements.

    Yellow Badge ("⚠️ Requires: [Equipment Name]") specifying needed items (Dumbbells, Barbell, Resistance Bands, Plyo Box, Medicine Ball, etc.).

Responsive Mobile & Desktop UI with local performance tracking and GitHub Pages deployment configuration.

## Development Environment
React: manages the interactive features of FitCraft 
    1. Excercise selection
    2. Custom Workout routines 
    3. Timers & session tracking
Vite: provides development server 
    1. Process react code
    2. Manage dependencies
    3. Provide local deployment server 
### Why?
Simply openeing the HTML file Gemini gave would not reliably run the application as written 
FitCraft original code was built using react componenets and JSX, which required a compatible development environment to function properly
**React provides FitCraft's interactive application structure (UI and logic), while vite provides the tools needed to develop, run, and build the application**




