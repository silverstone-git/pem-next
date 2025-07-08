# pem-next

## Description

pem-next is a personal blog project built with Next.js, React, and MongoDB. It aims to provide a platform for sharing articles and thoughts on tech, science, space, and other interesting topics.

## Features

*   **Blog Post Creation:**  Authenticated users (editors) can create and submit blog posts written in Markdown.
*   **Category Selection:**  Blog posts can be categorized for better organization and discoverability.
*   **Excalidraw Integration:**  Support for embedding Excalidraw diagrams within blog posts.
*   **Syntax Highlighting:** Code snippets in blog posts are highlighted using Highlight.js.
*   **LaTeX Support:** Mathematical equations can be rendered using KaTeX.
*   **Search Functionality:** Users can search for blog posts using keywords.
*   **Like and Comment System:**  Users can like blog posts and leave comments.
*   **Theme Switching:**  Support for light and dark themes.
*   **Responsive Design:**  The blog is designed to be responsive and accessible on different devices.
*   **Authentication:** Users can sign in using GitHub, Google, or email.

## Technologies Used

*   **Next.js:**  A React framework for building server-rendered and statically generated web applications.
*   **React:** A JavaScript library for building user interfaces.
*   **MongoDB:** A NoSQL database for storing blog posts, comments, and user data.
*   **NextAuth.js:**  An authentication library for Next.js.
*   **Tailwind CSS:**  A utility-first CSS framework for styling the application.
*   **Radix UI:**  A set of unstyled, accessible UI primitives.
*   **Lucide React:**  A collection of beautiful icons.
*   **Marked:** A markdown parser and compiler.
*   **Highlight.js:** A syntax highlighting library.
*   **KaTeX:** A math typesetting library.
*   **Isomorphic-DOMPurify:**  A DOMPurify sanitizer for both server and client.
*   **@excalidraw/excalidraw:** A virtual whiteboard tool.
*   **Google Gemini API:** Used for generating embedding vectors for search functionality.
*   **Sonner:** For toast notifications.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/silverstone-git/pem-next
    ```

2.  **Install dependencies:**

    ```bash
    cd pem-next
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env.local` file in the root directory and add the following environment variables:

    ```
    MONGODB_URI=<your-mongodb-connection-string>
    GITHUB_ID=<your-github-client-id>
    GITHUB_SECRET=<your-github-client-secret>
    GOOGLE_CLIENT_ID=<your-google-client-id>
    GOOGLE_CLIENT_SECRET=<your-google-client-secret>
    NEXTAUTH_SECRET=<your-nextauth-secret>
    EMAIL_SERVER=<your-email-server-settings>
    EMAIL_FROM=<your-email-address>
    GOOGLE_API_KEY=<your-google-gemini-api-key>
    EMAILS_EDITORS=<semicolon-separated-list-of-editor-emails>
    ```

    **Note:**
    *   Replace the placeholder values with your actual credentials and settings.
    *   `EMAILS_EDITORS` should contain a semicolon-separated list of email addresses that are authorized to write blog posts. For example: `john@doe.com;anothereditor@example.com`

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3054](http://localhost:3054) in your browser to view the blog.

## Deployment

The `pem-next` project can be deployed to various platforms, such as Vercel, Netlify, or a traditional Node.js server. Refer to the documentation of your chosen platform for specific deployment instructions.

## Contributing

Contributions to the `pem-next` project are welcome! If you find a bug or have a suggestion for a new feature, please open an issue or submit a pull request.

## License

[MIT](LICENSE)
