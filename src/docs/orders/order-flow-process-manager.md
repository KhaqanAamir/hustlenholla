# 📄 Proposal: Order Flow (Process Manager)

**Date:** 09/04/2025

---

## 🆕 New Flow

1. **Orders Table:**

   - Stores all orders approved by organizational admin.

2. **Requested Items Table:**

   - Contains all items associated with each order.

3. **Item Processes Table:**

   - Manages the lifecycle of each item through the following stages:
     - Cutting
     - Stitching
     - Washing
     - Finishing
     - Quality Control
     - Packaging
     - Dispatching

4. **Process Completion:**

   - Once an item completes all processes, it is marked "completed" in `requested_items`.

5. **Order Completion:**
   - When all items in an order are marked as completed, the corresponding order in the `orders` table is marked as "completed".

---

## ✅ Benefits

- **Better Tracking:** Clearly tracks progress of individual items.
- **Scalability:** Easy to add more processes via enum extension.
- **Efficient Queries:** Easier to filter and report based on process stages or completion.

---

## 🔄 Suggested Table Relationships

- **orders** ↔️ **requested_items** (1-to-many)
- **requested_items** ↔️ **item_processes** (1-to-many)

---

## 📊 Use Case Diagrams To Be Added

1. Order Lifecycle
2. Item Process Flow
3. Database Table Relationships (ERD)

Tools: Lucidchart / diagrams.net / Excalidraw

---
