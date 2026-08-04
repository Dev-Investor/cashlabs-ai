# Project Rules & Design Guidelines

## CRITICAL: Authorization Policy
- **NO UNAUTHORIZED CHANGES**: You are strictly PROHIBITED from making any changes, modifications, or optimizations to the code, logic, or design WITHOUT EXPLICIT AUTHORIZATION from the user (alexanderhs024@gmail.com). Every change must be ordered by the user.

## Data Integrity & Security
- **Mandatory Deletion Confirmation**: NEVER allow the deletion of key assets (AI Agents, History items, User profiles, etc.) without an explicit confirmation prompt. Use a custom modal (integrated into the component or via a shared UI component) to ensure full compatibility with the iframe environment, as standard `window.confirm` may be blocked.
- **Visual Feedback**: Always provide success/error feedback via `sonner` toasts after any destructive or creative operation.

## UI & Brand Identity
- **Primary Color (Spring Green)**: The primary accent color MUST be `#00FF9C`. This applies to glow effects, primary buttons, and level indicators.
- **Botón de Chat**: The chat button in `AgentsLab` must use the primary green background (`bg-neon-green`) as per its exact previous configuration.
- **Background**: Maintain the deep dark background `#0B0F14` for consistency and technical feel.
- **Typography**: Use Inter for general UI and black weights for headers to maintain the bold, premium feel of CashLabs AI.

## Technical Architecture
- **Firebase First**: All persistent data must be managed via Firestore using the defined security rules.
- **AI-Powered Features**: Always use the Gemini API (via server-side logic in `server.ts`) for complex diagnosis and content generation tasks.
