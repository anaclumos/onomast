# Email Setup Guide - Resend + Vercel DNS

This guide covers setting up email functionality for Better Auth using Resend with the sender address `this@is.onomast.app`.

## Prerequisites

- Resend account (sign up at https://resend.com)
- Access to Vercel project settings for onomast.app
- Domain: onomast.app configured in Vercel

## Step 1: Get Resend API Key

1. Log in to [Resend Dashboard](https://resend.com/overview)
2. Navigate to **API Keys** section
3. Click **Create API Key**
4. Name: `onomast-production`
5. Permission: **Full Access** (or **Sending Access** minimum)
6. Copy the API key (starts with `re_`)

## Step 2: Add Environment Variable to Vercel

```bash
# Using Vercel CLI
vercel env add RESEND_API_KEY

# Or via Vercel Dashboard:
# 1. Go to https://vercel.com/[your-team]/onomast/settings/environment-variables
# 2. Add RESEND_API_KEY with the value from Step 1
# 3. Select all environments (Production, Preview, Development)
```

Also add:
```bash
vercel env add BETTER_AUTH_URL
# Value: https://onomast.app (or your production URL)
```

## Step 3: Add Domain to Resend

1. In Resend Dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter: `is.onomast.app` (subdomain for email sending)
4. Click **Add**

Resend will provide DNS records like:

```
Type    Name                            Value
TXT     is.onomast.app                  v=spf1 include:amazonses.com ~all
TXT     resend._domainkey.is.onomast.app  [DKIM public key]
TXT     _dmarc.is.onomast.app           v=DMARC1; p=none;
MX      is.onomast.app                  feedback-smtp.us-east-1.amazonses.com (priority 10)
```

## Step 4: Add DNS Records via Vercel Dashboard

Since CLI requires team permissions, use the Vercel Dashboard:

1. Go to [Vercel Domains](https://vercel.com/[your-team]/onomast/settings/domains)
2. Find `onomast.app` and click **Manage DNS**
3. Add each record from Resend (Step 3):

### SPF Record
- **Type**: TXT
- **Name**: `is`
- **Value**: `v=spf1 include:amazonses.com ~all`

### DKIM Record
- **Type**: TXT
- **Name**: `resend._domainkey.is`
- **Value**: [Copy from Resend dashboard - long RSA key]

### DMARC Record
- **Type**: TXT
- **Name**: `_dmarc.is`
- **Value**: `v=DMARC1; p=none;`

### MX Record (Optional - for receiving)
- **Type**: MX
- **Name**: `is`
- **Value**: `feedback-smtp.us-east-1.amazonses.com`
- **Priority**: 10

## Step 5: Verify DNS Records

In Resend Dashboard:
1. Go to **Domains** > `is.onomast.app`
2. Click **Verify DNS Records**
3. Wait for propagation (can take up to 48 hours, usually 5-10 minutes)
4. Status should show **Verified** ✅

## Step 6: Test Email Sending

Local test:
```bash
# Create .env.local
echo "RESEND_API_KEY=re_your_key_here" >> .env.local
echo "BETTER_AUTH_URL=http://localhost:3000" >> .env.local

# Start dev server
bun run dev

# Test sign-up with email verification
# or password reset flow
```

## Email Features Enabled

With this setup, Better Auth can send:

1. **Email Verification**: When users sign up, they receive a verification link
2. **Password Reset**: Users can request password reset links via email

Sender: `this@is.onomast.app`

## Troubleshooting

### DNS Not Propagating
```bash
# Check DNS records
dig TXT is.onomast.app
dig TXT resend._domainkey.is.onomast.app
dig MX is.onomast.app
```

### Emails Not Sending
1. Check Resend Dashboard **Logs** for delivery status
2. Verify `RESEND_API_KEY` is set in Vercel environment variables
3. Check domain status is **Verified** in Resend
4. Look for errors in Vercel Function logs

### DMARC Policy
For production, update DMARC to stricter policy:
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@onomast.app
```

## Alternative: Vercel CLI (if you have permissions)

```bash
# Add DNS records via CLI
vercel dns add onomast.app is TXT "v=spf1 include:amazonses.com ~all"
vercel dns add onomast.app resend._domainkey.is TXT "[DKIM_KEY_FROM_RESEND]"
vercel dns add onomast.app _dmarc.is TXT "v=DMARC1; p=none;"
vercel dns add onomast.app is MX "feedback-smtp.us-east-1.amazonses.com" 10
```

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Vercel DNS Documentation](https://vercel.com/docs/concepts/projects/custom-domains#dns-records)
- [Better Auth Email Guide](https://www.better-auth.com/docs/authentication/email-password)
