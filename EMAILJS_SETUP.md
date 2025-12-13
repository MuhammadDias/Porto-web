# Setup EmailJS untuk Contact Form

## Step 1: Buat Akun EmailJS

1. Go to https://www.emailjs.com/
2. Sign up dengan akun Gmail atau email lain
3. Verifikasi email kamu

## Step 2: Tambah Email Service

1. Login ke EmailJS Dashboard
2. Go ke "Email Services" tab
3. Click "Add Service"
4. Pilih "Gmail" atau email provider kamu
5. Follow instruksi untuk authorize Gmail
6. Copy **Service ID** (contoh: service_8bxw2hs)

## Step 3: Buat Email Template

1. Go ke "Email Templates" tab
2. Click "Create New Template"
3. Isikan template seperti di bawah:

### Template Name:

`Contact Form Notification`

### Template Content:

```
Subject: New Contact Form Submission from {{from_name}}

---

Name: {{from_name}}
Email: {{from_email}}
Interest: {{interest}}

Message:
{{message}}

---

Sent from: Portfolio Website
```

4. Copy **Template ID** (contoh: template_r4md5el)

## Step 4: Dapatkan Public Key

1. Go ke "Account" tab
2. Scroll ke "Public Key" section
3. Copy Public Key (contoh: 9pHl0o87nPvLb3xvT)

## Step 5: Update Contact.jsx

Replace di Contact.jsx:

- `9pHl0o87nPvLb3xvT` → Public Key kamu
- `service_8bxw2hs` → Service ID kamu
- `template_r4md5el` → Template ID kamu
- `diasizzat222@gmail.com` → Email kamu

## Done! ✅

Sekarang ketika user mengirim form, email akan langsung masuk ke inbox kamu.

### Pricing:

- **Free Plan**: 200 emails/bulan
- **Pro Plan**: Unlimited emails (diperlukan jika traffic tinggi)

### Notes:

- EmailJS gratis dan aman
- Tidak perlu backend
- Langsung send dari browser user
- Template bisa di-customize di dashboard EmailJS
