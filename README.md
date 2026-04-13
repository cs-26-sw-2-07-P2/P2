P2 Projekt

# Start database
docker compose up -d

# Install dependencies
npm install

# Setup Prisma
npx prisma generate

npx prisma migrate dev

# Start server
npm run dev