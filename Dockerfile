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

# Stage สำหรับรัน Production (เปลี่ยนไปใช้ Nginx ขนาดเบาสำหรับเว็บสถิต)
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

# ลบไฟล์เริ่มต้นของ Nginx
RUN rm -rf ./*

# คัดลอกโฟลเดอร์ที่บิลด์เสร็จแล้ว (out) จาก builder มาเสิร์ฟ
COPY --from=builder /app/out ./

# คัดลอกการตั้งค่า Nginx สำหรับ Next.js Static Routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3005

CMD ["nginx", "-g", "daemon off;"]
