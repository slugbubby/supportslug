# supportslug

[slugbubby](https://www.twitch.tv/slugbubby)'s stream support utils

## development

```bash
# start db
docker compose up

# server commands
cd server && pnpm run start # compile & run server
pnpm run start:dev # watch mode
pnpm run start:prod # production mode

# client commands
cd client && pnpm run dev # start client
pnpm run package # build client library from src/lib
pnpm run build # create prod version from src/routes
pnpm run preview # preview prod build
```

## tech / resources

- [sveltekit frontend](https://svelte.dev/)
- [vite build tool](https://vite.dev/)
- [nestjs server](https://nestjs.com/)
- [drizzle orm](https://orm.drizzle.team/)
- [render deployment](https://render.com/)
