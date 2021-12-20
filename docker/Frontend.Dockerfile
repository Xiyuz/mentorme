FROM mentormeacr.azurecr.io/nodebase:latest
WORKDIR /usr/src/app
EXPOSE 3000

COPY frontend/ .
RUN npm install && npm ci --only=production && npm run build && ls -al

CMD ["npm", "run", "start"]
