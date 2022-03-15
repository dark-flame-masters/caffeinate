# Dockerfile adapted from
# https://mherman.org/blog/dockerizing-a-react-app/
# and https://github.com/marcson909/nest_js_docker_starter/blob/main/Dockerfile

# Compile into static js files
FROM node:14-alpine3.14 as frontend-builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./frontend/package.json ./
RUN npm i
RUN npm install react-scripts -g
COPY . .
RUN npm run build

# Compile node server
FROM node:14-alpine3.14 AS backend-builder
WORKDIR /app
COPY ./backend/package.json ./
RUN npm i
COPY . .
RUN npm run build

# Serve the frontend and backend in one app
FROM node:14-alpine3.14
COPY --from=frontend-builder /app/build ./build
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/package.json ./
COPY --from=backend-builder /app/backend/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]


# FROM node:14 AS builder
# WORKDIR /app
# COPY ./backend/package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# FROM node:14
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/backend/dist ./dist
# EXPOSE 3000
# CMD [ "node", "dist/main" ]