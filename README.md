# Lunch-Out Backend

This is a recommendation app for lunch places done as a technical exercise for a hiring process.

## Instructions

### Introduction

At [redacted] we love food, and we enjoy trying new places for lunch! Please help us by developing an application that suggests good restaurants to order from.

### General:

#### backend:

- Rest API
- Authenticated (choose whichever methods seems safest to you)
- Validate inputs as much as possible

#### Inputs:

- Localisation
- Max distance from localisation
- Price range in euros
- Attendees - Take into account the attendees’ cuisine type preferences
    - Gilles likes: [ Italian, Lebanese, Japanese, Belgian]
    - Vince likes: [ Italian, Japanese, Lebanese ]
    - Sam likes: [ Belgian ]
    - Klaas likes: [ Japanese, Belgian ]
    - Gaelle likes: [ Japanese, Lebanese ]

#### Outputs:

- List of 10 best restaurants / places to lunch given the inputs
- Try to make it that the best matching restaurants come first, but you still allow suggestions for restaurants that match less
