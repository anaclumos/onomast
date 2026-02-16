# 🔐 Final Step: Add DKIM Record from Resend

## ✅ DNS Records Already Added

The following DNS records for `is.onomast.app` have been added to Vercel:

1. **SPF Record** ✅
   - Name: `is`
   - Type: TXT
   - Value: `v=spf1 include:amazonses.com ~all`
   - Record ID: `rec_8d1069dd9eef84113f348edf`

2. **DMARC Record** ✅
   - Name: `_dmarc.is`
   - Type: TXT
   - Value: `v=DMARC1; p=none;`
   - Record ID: `rec_b5a39d22679074a526961bcd`

3. **MX Record** ✅
   - Name: `is`
   - Type: MX
   - Value: `feedback-smtp.us-east-1.amazonses.com`
   - Priority: 10
   - Record ID: `rec_9c8d1ae584e22a9cec5cf31b`

## 🔴 REQUIRED: Add DKIM Record (Needs Resend Dashboard)

The DKIM record is unique to your Resend account and must be obtained from the Resend dashboard.

### Steps:

1. **Log in to Resend Dashboard**
   ```
   https://resend.com/domains
   ```

2. **Add Domain**
   - Click "Add Domain"
   - Enter: `is.onomast.app`
   - Click "Add"

3. **Get DKIM Record**
   - After adding the domain, Resend will display DNS records
   - Find the **DKIM record** (looks like):
     ```
     Name: resend._domainkey.is
     Type: TXT
     Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ... (very long RSA key)
     ```

4. **Add DKIM to Vercel**
   ```bash
   vercel dns add onomast.app "resend._domainkey.is" TXT "p=MIGfMA0GCS..." --scope sunghyun-cho
   ```
   
   Replace the value with the **actual DKIM key from Resend**.

5. **Verify in Resend**
   - Go back to Resend Domains page
   - Click "Verify DNS Records" for `is.onomast.app`
   - All records should show as **Verified** ✅

## Environment Variables

Make sure these are set in Vercel:

```bash
# Get your API key from https://resend.com/api-keys
vercel env add RESEND_API_KEY --scope sunghyun-cho

# Your production URL
vercel env add BETTER_AUTH_URL --scope sunghyun-cho
# Value: https://onomast.app
```

## Verify DNS Propagation

```bash
# Check SPF
dig TXT is.onomast.app +short

# Check DMARC  
dig TXT _dmarc.is.onomast.app +short

# Check MX
dig MX is.onomast.app +short

# Check DKIM (after adding)
dig TXT resend._domainkey.is.onomast.app +short
```

## Test Email Sending

Once all DNS records are verified in Resend:

```bash
# Local test
echo "RESEND_API_KEY=re_..." >> .env.local
echo "BETTER_AUTH_URL=http://localhost:3000" >> .env.local

bun run dev

# Test password reset or email verification flow
```

## Troubleshooting

### DNS Records Not Showing
- DNS propagation can take 5-10 minutes (rarely up to 48 hours)
- Use `dig` commands above to check

### Resend Not Verifying
- Double-check DKIM value matches exactly (it's very long)
- Ensure no extra spaces in TXT record values
- Try "Verify" button again after 5 minutes

### Email Not Sending
1. Check Resend Dashboard > Logs for delivery status
2. Verify domain status is "Verified" (green checkmark)
3. Check Vercel Function logs for errors
4. Confirm `RESEND_API_KEY` is set correctly

## Next Steps

1. Add domain to Resend: https://resend.com/domains
2. Get DKIM record value
3. Run: `vercel dns add onomast.app "resend._domainkey.is" TXT "[DKIM_VALUE]" --scope sunghyun-cho`
4. Verify all records in Resend dashboard
5. Test email functionality

---

**Current Status**: 3/4 DNS records added. Only DKIM remaining (requires Resend dashboard).
