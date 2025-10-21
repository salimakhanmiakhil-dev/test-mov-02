# ---- Base image ----
FROM node:20-alpine

# ---- Set working directory ----
WORKDIR /app

# ---- Copy and install dependencies ----
COPY package*.json ./
RUN npm install --production

# ---- Copy project files ----
COPY . .

# ---- Expose port ----
EXPOSE 3000

# ---- Start the app ----
CMD ["npm", "start"]