# SaathHisab REST API Reference

Base URL: `/api/v1`

Standard Error Format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | UNAUTHORIZED | FORBIDDEN | CONFLICT | INTERNAL_SERVER_ERROR",
    "message": "Human readable message",
    "details": []
  }
}
```

Money is always represented as **integer paisa** in responses and requests.

### Endpoints
- `GET /health` - System healthcheck
- `POST /auth/signup` - Register user
- `POST /auth/login` - Authenticate & set session cookie
- `POST /auth/logout` - Clear session
- `GET /auth/me` - Authenticated user details
- `PATCH /users/me` - Update profile
- `GET /groups` - User's groups with balance summary
- `POST /groups` - Create group
- `GET /groups/:groupId` - Group details & members
- `PATCH /groups/:groupId` - Update group (owner only)
- `DELETE /groups/:groupId/members/:userId` - Remove member
- `POST /groups/:groupId/leave` - Leave group
- `POST /groups/:groupId/invitations` - Create invite
- `DELETE /groups/:groupId/invitations/:id` - Revoke invite
- `GET /invitations/:token` - Preview invite
- `POST /invitations/:token/accept` - Accept invite
- `GET /groups/:groupId/expenses` - List expenses with filters
- `POST /groups/:groupId/expenses` - Create expense
- `GET /groups/:groupId/expenses/:id` - Expense detail
- `PATCH /groups/:groupId/expenses/:id` - Edit expense
- `DELETE /groups/:groupId/expenses/:id` - Soft delete expense
- `GET /groups/:groupId/balances` - Balances and suggested transfers
- `GET /groups/:groupId/summary` - Group expense summary
- `GET /groups/:groupId/settlements` - List settlements
- `POST /groups/:groupId/settlements` - Record settlement
- `POST /groups/:groupId/settlements/:id/confirm` - Confirm settlement
- `POST /groups/:groupId/settlements/:id/reject` - Reject settlement
- `POST /groups/:groupId/settlements/:id/cancel` - Cancel settlement
- `GET /groups/:groupId/activity` - Group activity feed
