# Home Library Service

## Set up the project

```bash
git clone https://github.com/Macadamandi/containerization-database-orm.git
cd containerization-database-orm
git checkout develop
```

## Installing dependencies

```bash
npm install
```

or

```bash
npm ci
```

## ENV variables

Copy .env.example and change to .env

## Running with Docker image

Start the app and PostgreSQL together using Docker Compose:

```bash
docker-compose up
```

**Details:**

- Docker Compose reads the `docker-compose.yml` file in the project root.
- The `app` service uses the image `macadamandi/containerization-database-orm:latest`.
  - If this image is **not available locally**, Docker will automatically pull it from Docker Hub.
- The `postgres` service uses the official `postgres:16-alpine` image, which will also be pulled automatically if not found locally.
- After startup:
  - The app is available at [http://localhost:4000](http://localhost:4000)
  - OpenAPI docs are available at [http://localhost:4000/doc/](http://localhost:4000/doc/)

## Running tests

**⚠️ Make sure the server is running before running tests!**

Run all tests:

```bash
npm run test
```

## Linting

Lint the project:

```bash
npm run lint
```