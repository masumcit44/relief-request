# Member 2 Task: Backend and Database Developer

## Role
Backend and Database Developer

## Core Task
- Configure Supabase or the agreed data layer.
- Create the `sos_requests` data schema.
- Implement request insert, fetch and status update functions.
- Keep secrets only in local environment files.
- Create or update `.env.example` without placing real secret values inside it.
- Do not modify the rescue map UI unless integration requires it.

## Expected Branch
`feature/member2-backend-database`

## Suggested Commit
```bash
git add .
git commit -m "feat(data): add SOS request storage and status updates"
git push -u origin feature/member2-backend-database
```

## Local Development
Port: 3002
```bash
npm run dev -- --port 3002
```
