# BookMarkHub

A browser bookmark manager optimized for capture and retrieval speed.

- Extract page title and url into a structured bookmark entry.
- One-click to save bookmarks as GitHub issues in your repository.
- Add new tags or reuse the ones from previous bookmarks.
- Instant search and organization using GitHub's powerful issue search and filtering.

## Screenshot

![BookmarkHub Extension Interface](./src/assets/bookmarkhub.svg)

## Get started

### Install

- Chrome and Edge: Load the extension from `./output/chrome-mv3-prod` after building
- Firefox: Load the extension from `./output/firefox-mv2-prod` after building

### Connect to GitHub

- When you activate the extension from browser toolbar for the 1st time, click the button to connect to GitHub.
- Provide your GitHub username and repository name where you want to store bookmarks.
  - If you don't have a repo yet, create a new repository on GitHub for storing your bookmarks.
  - You can set the visibility of your repo to either Public or Private. The extension works in both cases.
- Create a new [fine-grained access token](https://github.com/settings/personal-access-tokens/new) for the extension to create issues on your behalf. Make sure you select the correct repo and grant `Issues` permission with `Read and write` access.
- Click Connect and make sure you get a success message.
- Now navigate to any page and re-open the extension. You will be able to save new bookmarks as GitHub issues.

## FAQ

### How to open the extension with keyboard shortcut?

> By default, you can assign a keyboard shortcut to open the extension. You can customize it with browser extensions settings.
>
> - Chrome and Edge: visit `chrome://extensions/shortcuts`
> - Firefox: visit `about:addons` and configure shortcuts in the extension settings.

### How are bookmarks organized?

> Bookmarks are stored as GitHub issues in your repository. Each bookmark becomes an issue with:
> - Title: The page title
> - Body: The URL and any additional notes
> - Labels: Tags for categorization
> - This allows you to use GitHub's powerful search, filtering, and organization features.

## Development

This project is built with:

* [WXT](https://wxt.dev/) (browser extension framework)
* [React](https://react.dev/)
* [TailwindCSS](https://tailwindcss.com/)
* [shadcn](https://ui.shadcn.com/) (component design system)
* [Octokit](https://github.com/octokit/octokit.js) (GitHub API integration)

### Getting Started

First, run the development server:

```bash
pnpm i
pnpm dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `./output/chrome-mv3-dev`.

For further guidance, [visit our Documentation](https://docs.wxt.dev/)

### Adding new components

New components can be added via the shadcn cli like so:
```
pnpm dlx shadcn@latest add tooltip 
```

### Making production build

Run the following:

```bash
pnpm build
# Build for specific browsers
pnpm build:firefox
```
