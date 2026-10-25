# Member 1 Task: Frontend SOS Form Developer

## Role
Frontend SOS Form Developer

## Core Task
- Build the victim SOS form.
- Capture name, people count, urgency and location.
- Use browser Geolocation API.
- Produce request data matching the shared API contract.
- Do not modify the rescue map unless integration requires a small change.

## Expected Branch
`feature/member1-sos-form`

## Suggested Commit
```bash
git add .
git commit -m "feat(sos): add victim SOS form and geolocation"
git push -u origin feature/member1-sos-form
```

## Local Development
Port: 3001
```bash
npm run dev -- --port 3001
```
Open `http://localhost:3001` to test the victim SOS form.
