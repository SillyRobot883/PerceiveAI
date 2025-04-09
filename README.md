## Project Overview
PerceiveAI is an innovative project aimed at making sports commentary accessible to the deaf and hard-of-hearing community. By leveraging cutting-edge AI technologies, PerceiveAI translates live sports commentary into sign language using animated avatars. This ensures that everyone, regardless of their hearing abilities, can enjoy the excitement and passion of live sports events.

The project is designed to bridge the gap between accessibility and inclusivity in sports broadcasting, aligning with global efforts to create a more inclusive digital experience.

## Features
- **Real-Time Transcription:** Converts live sports commentary into text using advanced speech-to-text technologies.
- **Sign Language Translation:** Maps transcribed text to corresponding sign language gestures using SigML (Signing Gesture Markup Language).
- **3D Avatar Integration:** Displays sign language translations through animated avatars powered by CWASA (Controlled Web Avatar Sign Language Animator).
- **Customizable Dictionaries:** Supports regional and contextual sign language variations for accurate translations.
- **User-Friendly Interface:** Provides an intuitive web-based interface for users to interact with the system and view translations seamlessly.

## Screenshots
![PerceiveAI](https://github.com/user-attachments/assets/fbffa61a-d7f0-4996-91d3-e46024df830b)
![PerceiveAI_Demo](https://github.com/user-attachments/assets/ffca198d-facf-4b9d-9932-b86fbe2d7f4d)


## Technologies Used



### Core Technologies
- **Speech Recognition:**  
  Converts live audio commentary into text using advanced speech-to-text models. Supports multiple transcription methods, including OpenAI Whisper and YouTube captions.
- **Natural Language Processing (NLP):**  
  Processes transcribed text to identify key phrases and map them to corresponding sign language gestures. Handles contextual understanding for sports-specific terminology.
- **SigML (Signing Gesture Markup Language):**  
  A markup language used to define sign language gestures for avatars. Ensures precise and accurate representation of sign language movements.
- **CWASA (Controlled Web Avatar Sign Language Animator):**  
  A web-based framework for animating 3D avatars to perform sign language gestures. Provides smooth and realistic animations for an engaging user experience.

### Frontend Technologies
- **HTML5, CSS3, and TailwindCSS:** For building a responsive and visually appealing user interface.
- **JavaScript:** For dynamic interactions and real-time updates.
- **Chart.js:** For visualizing data, such as the impact of the project on accessibility.

### Backend and Infrastructure
- **Node.js:** For handling server-side logic and API integrations.
- **WebSockets:** For real-time communication between the transcription system and the avatar.
- **GitHub:** For version control and collaboration.

### Tech Stack Summary
| Technology        | Purpose                                                             |
|-------------------|---------------------------------------------------------------------|
| SigML             | Defines sign language gestures for avatars.                         |
| CWASA             | Animates 3D avatars to perform sign language gestures.               |
| OpenAI Whisper    | Provides accurate speech-to-text transcription.                      |
| Chart.js          | Visualizes project impact and statistics.                           |
| TailwindCSS       | Creates a responsive and modern user interface.                     |
| Node.js           | Handles backend logic and API communication.                        |
| WebSockets        | Enables real-time communication between components.                 |

## Screenshots to Include
- **Homepage:**  
  Show the main landing page with the tagline "Translating Sports Excitement into Sign Language." Highlight the call-to-action buttons like "Try Now" and "Learn More."
- **Live Transcription and Avatar:**  
  Display the transcription bar with live text and include the 3D avatar performing sign language gestures.
- **Impact Statistics:**  
  Display statistics like "5.9% Disability Rate in Saudi Arabia" and "229K+ Hearing Impaired Individuals."
- **Workflow Screenshot:**  
  _[Place a screenshot here of the workflow diagram]_
- **Video Player Page Screenshot:**  
  _[Place a screenshot here of the video player page where the avatar and transcription are displayed]_
- **Team Section:**  
  Showcase the team members with their photos and LinkedIn links.
- **Demo Section:**  
  Highlight the demo section where users can input a YouTube link and see the transcription and avatar in action.
- **About Section:**  
  Include the "About PerceiveAI" section explaining the project's mission and alignment with Vision 2030.

## How to Run the Project
Copy and paste the following commands into your terminal to set up and run the project:

```bash
# Clone the repository
git clone https://github.com/yourusername/PerceiveAI.git && cd PerceiveAI

# Install dependencies
npm install

# Start the development server
npm run dev

# Open your browser and navigate to http://localhost:3000 to see the project in action.


Contribution Guidelines
We welcome contributions to improve PerceiveAI! Here's how you can help:

Fork the repository.

Create a new branch for your feature or bug fix.

Commit your changes and push them to your fork.

Submit a pull request with a detailed description of your changes.

License
This project is licensed under the MIT License. See the LICENSE file for more details.
