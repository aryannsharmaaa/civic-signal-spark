# Civic Signal Spark

IMPORTANT: Improve and build the existing CivicSense project as a functional hackathon MVP.



Keep the original CivicSense concept, branding, design direction and all core features.



ADDITIONAL FUNCTIONAL REQUIREMENTS:



1. FUNCTIONAL DASHBOARD



- All dashboard statistics must be dynamically calculated from the issue data.

- Resolution percentage must update automatically.

- All filters must work.

- Upvote buttons must work and prevent repeated voting by the same demo user.



2. SMART ISSUE REPORTING



- Form validation for all required fields.

- Image preview before submission.

- Add sample images for demonstration.

- New issues must immediately appear in the Live City Feed.

- Award +50 Karma only once per successfully submitted demo issue.

- Persist demo data using localStorage.



3. AI AUTO-ANALYZE



- Create a simulated AI analysis experience without requiring paid API keys.

- Analyze the description using simple predefined rules.

- Suggest issue category, severity and a formal complaint summary.

- Clearly identify this feature as AI-assisted simulation, not real AI inference.



4. ADMIN DASHBOARD



- Create a clearly labelled Demo Admin Mode.

- Allow status changes between Reported, In Progress and Resolved.

- Update the main dashboard statistics automatically.

- Never imply that the application is connected to an actual municipal authority.



5. LEADERBOARD



- Display realistic fictional demo contributors.

- Calculate ranks using Karma points.

- Add badges and achievement titles.

- Mark all reward redemption options as concept previews, not actual redeemable benefits.



6. DATA AND TESTING



- Preload 8 sample civic issues.

- Include different categories and severity levels.

- Include 2 resolved sample issues with clearly labelled illustrative before/after images.

- Use local React state and localStorage.

- Ensure the application works without external paid APIs or backend setup.

- Add loading states, empty states and error handling.



7. DESIGN AND ACCESSIBILITY



- Maintain a polished modern SaaS design.

- Dark and light mode must work.

- Ensure mobile and desktop responsiveness.

- Use accessible buttons, labels and readable contrast.



FINAL REQUIREMENT:

Do not create a static mockup. Build a genuinely interactive and testable MVP. Test every major button, form, filter, status update and dashboard calculation before considering the project complete.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2e19a38b-a1a0-495f-a380-885a9aabd8c8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
