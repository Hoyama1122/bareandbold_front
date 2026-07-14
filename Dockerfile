FROM node:20-alpine AS builder

WORKDIR /app

# คัดลอกไฟล์การตั้งค่าแพ็คเกจ
COPY package.json package-lock.json* bun.lock* ./

# ติดตั้ง dependencies ทั้งหมด
RUN npm install

# คัดลอกไฟล์โปรเจกต์ทั้งหมดและสร้างหน้าเว็บ (Build)
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# Stage สำหรับรัน Production (ใช้ Node.js รันเซิร์ฟเวอร์แบบไดนามิก)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# คัดลอกเฉพาะไฟล์ที่จำเป็นสำหรับการรัน
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3005

CMD ["npm", "run", "start"]
