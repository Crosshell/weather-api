FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 50300

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]