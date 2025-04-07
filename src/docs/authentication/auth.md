# 📦 Create Order Flow

## ✅ Current Flow

1. User sends request to `/orders/create`
2. Backend validates the order payload using DTO
3. Checks inventory and user balance
4. Creates order and sends notification

## 🔍 Code References

- `orders.controller.ts`
- `orders.service.ts`
- `inventory.service.ts`

## ⚠️ Issues with Current Flow

- No retry logic if inventory check fails
- Notifications fail silently
- Payment is not confirmed before creation

---

# ✍️ Proposal: Improve Create Order Flow

## 🆕 New Flow

1. Reserve inventory first
2. Initiate payment and confirm success
3. Create order only after both succeed
4. Add logs and alerts for failures

## ✅ Benefits

- More robust
- Better UX and observability
- Easier to debug

## 🔁 Rollout Plan

1. Flag-based rollout for 5% traffic
2. Logs + alerts
3. Full switch after 3 days if no issues

## 👥 Pending Approvals

- [ ] Team Lead - @john
- [ ] QA - @jane
