FROM node:20-alpine AS builder

WORKDIR /app

# คัดลอกไฟล์การตั้งค่าแพ็คเกจ
COPY package.json package-lock.json* bun.lock* ./

# ติดตั้ง dependencies ทั้งหมด
RUN npm install

# คัดลอกไฟล์โปรเจกต์ทั้งหมดและสร้างหน้าเว็บ (Build)
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage สำหรับรัน Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# คัดลอกข้อมูลเฉพาะที่จำเป็นในการรันระบบ
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3005

CMD ["npm", "run", "start", "--", "-p", "3005"]
