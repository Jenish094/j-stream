# J-Stream

[![J-Stream Image](.github/J-Stream.png)](https://j-stream.github.io/docs/)

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjenish094%2Fj-stream)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jenish094/j-stream)

**NOTE: To self-host, more setup is required. Check the [docs](https://jenish094.github.io/jstream-docs/) to properly set up!!!!**

## Links And Resources

| Service       | Link                                                                  | Source Code                                              |
| ------------- | --------------------------------------------------------------------- | -------------------------------------------------------- |
| J-Stream Docs | [docs](https://jenish094.github.io/jstream-docs/)                     | [source code](https://github.com/jenish094/jstream-docs) |
| Extension     | [extension](https://jenish094.github.io/jstream-docs/extension)       | [source code](https://github.com/jenish094/browser-ext)  |
| Proxy         | [simple-proxy](https://jenish094.github.io/jstream-docs/simple-proxy) | [source code](https://github.com/jenish094/simple-proxy) |
| Backend       | [backend](https://github.com/jenish094/backend)                       | [source code](https://github.com/jenish094/backend)      |
| Frontend      | [J-Stream](https://jenish094.github.io/jstream-docs/instances)        | [source code](https://github.com/jenish094/j-stream)     |
| Weblate       | [weblate](https://jenish094.github.io/jstream-docs/weblate)           |                                                          |

## Referrers

- [FMHY (Voted as #1 streaming site of 2024, 2025)](https://fmhy.net)

## Running Locally

Type the following commands into your terminal / command line to run J-Stream locally

```bash
git clone https://github.com/jenish094/j-stream.git
cd j-stream
git pull
pnpm install
pnpm run dev
```

Then you can visit the local instance [here](http://localhost:5173) or, at local host on port 5173.

## Updating a J-Stream Instance

To update a J-Stream instance you can type the below commands into a terminal at the root of your project.

```bash
git remote add upstream https://github.com/jenish094/j-stream.git
git fetch upstream # Grab the contents of the new remote source
git checkout <YOUR_MAIN_BRANCH>  # Most likely this would be `origin/production`
git merge upstream/production
# * Fix any conflicts present during merge *
git add .  # Add all changes made during merge and conflict fixing
git commit -m "Update j-stream instance (merge upstream/production)"
git push  # Push to YOUR repository
```

## Contact Me / Discord

[Discord](https://discord.gg/rVa8jzGR)
