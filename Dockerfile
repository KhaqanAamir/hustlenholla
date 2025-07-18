FROM node:22

WORKDIR /app

COPY package*.json ./

ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

COPY prisma ./prisma/

RUN npx prisma generate

RUN npm install

COPY . .

EXPOSE 3005

CMD ["npm", "run", "start"]
