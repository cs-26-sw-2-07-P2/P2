# P2 Projekt

# Install dependencies

npm ci or npm install (Dont update packages)

# Start/setup database

docker compose up -d

# Setup Prisma

npx prisma generate

npx prisma migrate dev

# Start server

npm run dev
