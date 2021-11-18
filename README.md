## Project Lutein

### Introduction

This project uses a browser plug-in to alert users to any Facebook posts of theirs that may have been censored. The goal is to help the general public understand the platform’s censorship behavior, to collect censored public content into a public dataset, and to evaluate the neutrality of social media content censorship.

It is difficult for individuals to grasp the full picture of social media censorship. They may not be aware that their speech is being censored or deprioritized by algorithms. This project uses a browser plug-in to alert users to any Facebook posts of theirs that may have been censored. The goal is to help the general public understand the platform’s censorship behavior, to collect censored public content to public dataset, and to evaluate the neutrality of social media content censorship.

This project is an open research project beginning with Facebook, and invites the open source community to migrate to any other social media platforms.

By installing this Chrome Extension plugin, you can:
1. Discover which of your public posts have been blocked or removed from social platforms.
2. Contribute the censored posts that have been removed or blocked to the public dataset. This public dataset will serve as the basis for Taiwan AI Labs’  research on social media censorship.

If you install this plugin, you agree to the above description and allow Taiwan AI Labs to include your censored posts in this project.

We build our project based on [salsita/chrome-extension-skeleton](https://github.com/salsita/chrome-extension-skeleton).

### How to use it:

1. Install webpack if you don't have it:

```
npm install -g webpack
```

2. Install dependencies:

```
cd ${localProjectDir}

npm install
```

3. To start a developing session (with watch), run:

```
npm start
```

4. To build production code and crx:

```
npm run build
```

5. Your build artifact should be place in `build` folder:
- `dev` subfolder for **npm start**
- `prod` subfolder for **npm run build**

