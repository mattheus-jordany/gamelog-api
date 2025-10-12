FROM node:18-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3333
# CMD ["npm", "run", "dev"]
CMD ["tail", "-f", "/dev/null"]