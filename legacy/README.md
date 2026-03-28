# pdfreaderX
Open-Source PDF Reader

# 📚 PDF ReaderX with Read Aloud

![HTML & JavaScript](https://img.shields.io/badge/Built%20With-HTML%20%26%20JavaScript-blue?style=for-the-badge&logo=javascript)
![PDF.js](https://img.shields.io/badge/Powered%20By-PDF.js-orange?style=for-the-badge&logo=npm)
![Web Speech API](https://img.shields.io/badge/Voice-Web%20Speech%20API-green?style=for-the-badge)

---

## ✨ Overview

This project presents a robust and user-friendly web-based PDF reader with an integrated "Read Aloud" feature. Built using pure HTML and JavaScript, it leverages the powerful PDF.js library to render PDF documents directly in your browser, and the Web Speech API for seamless text-to-speech functionality. Users can load PDFs from URLs or local files, navigate through pages, and have selected text or entire pages read aloud with customizable voices and reading speeds.

This application is designed for accessibility and convenience, making PDF content more interactive and approachable.

---

## 🌟 Key Features

* **📖 PDF Rendering:** Display PDF documents directly in the browser using the PDF.js library.
* **🔗 Load from URL:** Easily load PDFs by providing a direct URL.
* **📂 Load Local Files:** Upload and view PDF documents from your local machine.
* **🗣️ Text-to-Speech (TTS):**
    * **Read Selection:** Highlight any text on the PDF and have it read aloud.
    * **Read Current Page:** Initiate reading for the entire visible page.
    * **Continuous Reading:** Automatically advance to and read subsequent pages after completing the current one.
    * **Word Highlighting:** Visually highlights the words being spoken for enhanced tracking.
* **⏯️ Playback Controls:** Comprehensive controls including Play, Pause, Resume, and Stop for the text-to-speech feature.
* **⚙️ Customizable Speech:**
    * **Reading Speed:** Adjust the speaking rate (slow, medium, fast).
    * **Voice Selection:** Choose from a variety of available voices provided by your browser's Web Speech API.
* **🔄 Page Navigation:** Intuitive "Previous" and "Next" buttons, along with a "Go to Page" input for quick jumps.
* **📱 Responsive Design:** Adapts to various screen sizes, ensuring a good experience on desktop and mobile devices.

---

## 🛠️ How It Works (Technical Deep Dive)

This application is a single-page HTML file (`pdfreaderX.html`) that combines HTML for structure, CSS (via Tailwind CSS) for styling, and JavaScript for all its dynamic functionality.

### 1. PDF Loading & Rendering

* **PDF.js Integration:** The core PDF rendering is handled by [PDF.js](https://mozilla.github.io/pdf.js/), a JavaScript library developed by Mozilla. It takes a PDF document (either as a URL or an `ArrayBuffer` from a file) and converts its pages into images on an HTML `<canvas>` element.
* **`pdfjsLib.getDocument()`:** This asynchronous function is used to load the PDF.
* **`page.render()`:** Each page is rendered onto the `<canvas>` element using the `page.render()` method, which draws the visual content.

### 2. Interactive Text Layer

* **Invisible Overlay:** Crucially, PDF.js provides a `TextLayerBuilder` (or in this custom implementation, manually created `div` elements) that overlays invisible, selectable text elements on top of the rendered PDF canvas. These `div` elements mimic the layout and position of the actual text on the PDF.
* **Purpose:** This invisible text layer allows users to **select text** with their mouse, just like they would in a native PDF reader. This selection is essential for the "Play Selection" feature. The `opacity: 0.001` and `color: transparent` CSS properties make these `div`s visually invisible while still being interactive.
* **Synchronization:** The JavaScript dynamically creates these text `div`s and positions them precisely over the canvas content, ensuring that what you see and what you can select are aligned.

### 3. Text-to-Speech (TTS) with Web Speech API

* **`window.speechSynthesis`:** This built-in browser API (`SpeechSynthesis`) is the engine for all voice-related functionality.
* **`SpeechSynthesisUtterance`:** When text needs to be spoken, a `SpeechSynthesisUtterance` object is created. This object holds the text, desired voice, and speaking rate.
* **`synth.speak()`:** The `SpeechSynthesis` instance (`synth`) then uses its `speak()` method to convert the `SpeechSynthesisUtterance` into audible speech.
* **Voice Management:**
    * `synth.getVoices()` is used to fetch all available voices on the user's system.
    * These voices are populated into a `<select>` dropdown, allowing users to choose their preferred narrator.
    * A default voice (e.g., "Microsoft Andrew Online (Natural)" or any English voice) is attempted to be selected for immediate use.
* **Playback Controls:** `synth.pause()`, `synth.resume()`, and `synth.cancel()` are used to control the speech playback.

### 4. Dynamic Highlighting

This project employs two distinct highlighting mechanisms:

* **TTS Word Highlighting (`highlighted-word` class):**
    * The `SpeechSynthesisUtterance` object fires `onboundary` events as it speaks. These events provide `charIndex` and `charLength`, indicating the current word's position within the spoken text.
    * The JavaScript identifies the corresponding text `div` element from the `textLayer` that contains the spoken word.
    * Instead of trying to wrap individual words with `<span>` elements (which can be fragile with PDF text layouts), the **entire `div` containing the word is temporarily assigned the `highlighted-word` CSS class**. This provides a consistent and visually clear highlight as the speech progresses.
    * The `removeHighlights()` function ensures these temporary highlights are cleared after speaking or upon user action.
* **User Selection Highlighting (`user-selection-highlight` class):**
    * When a user selects text in the `textLayer` (detected via `mouseup` and `selectionchange` events), the `applyUserSelectionHighlight()` function is triggered.
    * It retrieves the user's `window.getSelection()` range.
    * For each text node within the selected range, it attempts to `surroundContents()` with a `<span>` element carrying the `user-selection-highlight` class. This creates a precise visual highlight that matches the user's selection.
    * A `removeUserSelectionHighlight()` function ensures these highlights are cleared when the selection changes or is cleared.

### 5. Responsive Design

* **Tailwind CSS:** The project utilizes Tailwind CSS for its styling, enabling a utility-first approach to quickly build a responsive and modern UI.
* **`viewport` Meta Tag:** The `<meta name="viewport" content="width=device-width, initial-scale=1.0">` ensures proper scaling on mobile devices.
* **Fluid Widths:** The PDF canvas and control containers use relative widths (`width: 100%`, `max-width`) and Tailwind's responsive classes (`sm:flex-row`, `flex-grow`) to adapt to different screen sizes.

---

## 🚀 Getting Started

To run this PDF reader locally, follow these simple steps:

1.  **Clone the repository (or download the file):**
    ```bash
    git clone https://github.com/wikicrafter/pdfreaderX.git
    cd pdfreaderX
    ```
    

2.  **Open `pdfreaderX.html` in your web browser:**
    Simply double-click the `pdfreaderX.html` file. Most modern browsers will execute the JavaScript directly.

3.  **Explore the features:**
    * The demo PDF will load automatically from the default URL.
    * Try uploading your own PDF using "Load from File".
    * Select text and click "Play Selection".
    * Click "Read Current Page" to listen to the whole page.
    * Adjust speed and voice in the controls section.

---

## 🛣️ Future Enhancements & React Migration

This project, while functional, serves as a strong foundation. We have exciting plans to enhance its architecture and capabilities:

* **React.js Conversion:**
    * **Goal:** The primary future goal is to migrate the entire application to **React.js**.
    * **Benefits:** This transition will allow us to:
        * **Component-Based Architecture:** Break down the UI into reusable, modular components (e.g., `PdfViewer`, `ControlPanel`, `VoiceSelector`).
        * **State Management:** Utilize React's state management (e.g., `useState`, `useContext`, or potentially Redux/Zustand for larger applications) for more predictable and maintainable data flow.
        * **Improved Scalability:** Facilitate easier addition of new features and complex interactions without tangled DOM manipulations.
        * **Better Developer Experience:** Leverage the React ecosystem, including developer tools and a vast community.
        * **Potential for Modern Features:** Integrate with other React libraries for advanced UI/UX (e.g., Shadcn UI, Recharts).
* **Accessibility Improvements:** Further enhance ARIA attributes and keyboard navigation.
* **Performance Optimizations:** Optimize rendering for very large PDF documents.
* **User Settings Persistence:** Save user preferences (last PDF opened, voice, speed) using local storage or a backend.
* **Annotation Tools:** Add features like highlighting, notes, and drawing directly on the PDF.
* **Search Functionality:** Implement in-document text search.

---

## 🤝 Contributions

We welcome and encourage contributions from the community! Whether it's a bug fix, a new feature, or an improvement to the documentation, your input is valuable.

### How to Contribute

1.  **Fork** this repository.

2.  **Clone** your forked repository to your local machine:
    ```bash
    git clone 
    ```

3.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    # OR
    git checkout -b bugfix/issue-description
    ```

4.  **Make your changes.** Ensure your code adheres to a clean, readable style.

5.  **Commit your changes** with a clear and descriptive commit message:
    ```bash
    git commit -m "feat: Add new awesome feature"
    # OR
    git commit -m "fix: Resolve issue with highlight inconsistency"
    ```

6.  **Push your changes** to your forked repository:
    ```bash
    git push origin feature/your-feature-name
    ```

7.  **Open a Pull Request (PR)**:
    * Go to the original repository on GitHub.
    * You should see a prompt to create a Pull Request from your branch.
    * Provide a clear title and description for your PR, explaining the changes you've made and why they are beneficial.
    * Reference any related issues (e.g., `Closes #123`).

### Contribution Guidelines

* **Code Style:** Maintain a clean, readable, and consistent JavaScript style. Add comments where necessary to explain complex logic.
* **Testing:** For any significant new feature or bug fix, consider how it can be tested (manual testing is fine for this project for now).
* **Documentation:** Update the `README.md` or add comments if your changes impact how the application works or is used.
* **Be Respectful:** We believe in a collaborative and supportive environment. Please be respectful and constructive in your interactions.

---

## 📄 License

This project is open-source and available under the **MIT License**.

Feel free to use, modify, and distribute this code. See the `LICENSE` file for more details.

---

## 📞 Contact

For any questions or support, please open an issue in the GitHub repository.

---

Enjoy your enhanced PDF reading experience!

