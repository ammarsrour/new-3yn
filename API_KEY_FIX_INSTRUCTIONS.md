# CRITICAL: OpenAI API Key Fix Required

## Problem
Your OpenAI API key is **invalid or expired**, causing all analyses to use fallback scores (78/100).

**Error from console:**
```
OpenAI API error: 401 - Incorrect API key provided: sk-proj-******************w0cA
```

---

## Solution: Update API Key

### Step 1: Get a Valid OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in to your OpenAI account
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-proj-` or `sk-`)
5. **Important:** The key will only be shown once - save it securely

### Step 2: Update `.env` File

Replace the current invalid key in `.env`:

```env
VITE_OPENAI_API_KEY=your_new_valid_key_here
```

**Current invalid key (line 1):**
```
VITE_OPENAI_API_KEY=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
```

### Step 3: Restart Development Server

After updating `.env`, you MUST restart the dev server:

```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

---

## How to Verify It Works

After updating the key and restarting, upload a billboard and check console:

**Before (with invalid key):**
```
OpenAI API error: 401 - Incorrect API key provided
Using enhanced fallback response due to API error
AI Analysis returned: {overallScore: 78, ...}  ← Fallback!
```

**After (with valid key):**
```
OpenAI API response status: 200  ← Success!
OpenAI API response received: {...}
AI Analysis returned: {overallScore: 45, ...}  ← Real AI score!
```

---

## Expected Behavior After Fix

With a valid API key:

1. **English-only billboards:** Score ≤45/100 with "LEGAL VIOLATION: Ordinance 25/93"
2. **Critical issues:** "No Arabic text present - Municipality can remove billboard"
3. **Specific analysis:** References actual billboard content (not generic)

---

## Why This Happened

OpenAI API keys can expire or become invalid if:
- The key was revoked
- Billing issues on OpenAI account
- Rate limits exceeded
- Key was regenerated on OpenAI dashboard

---

## Cost Estimate

- **Model:** GPT-4 Vision (gpt-4o)
- **Cost per analysis:** ~$0.02-0.05 USD
- **For 100 analyses:** ~$2-5 USD

Make sure your OpenAI account has available credits.
