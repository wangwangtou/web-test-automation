# Case YAML Schema

Use UTF-8 YAML. Keep strings quoted when they contain `:`, `#`, or `{}`.

```yaml
schema_version: 1
id: orders-create
title: Create an order
purpose: Verify that a sales representative can create an order and its resulting record is visible.
version: 1
parent_version: null
roles:
  - name: sales-representative
    session_key: sales-representative
    responsibility: Create and submit the order.
business_flow:
  preconditions:
    - The sales representative is authenticated.
    - An active customer and product are available.
  steps:
    - role: sales-representative
      outcome: Open the order form and submit a valid order.
    - role: sales-representative
      outcome: Confirm the newly created order appears in the order list.
  expected_outcome: The new order is persisted and visible to the sales representative.
base_url: https://example.test
stable_node:
  module: ./node/orders-create.v1.mjs
  timeout_ms: 10000
  steps:
    - id: open-orders
      action: page.goto('/orders')
      snapshot: before-create
    - id: submit-order
      action: page.getByRole('button', { name: 'Create order' }).click()
      snapshot: after-create
natural_language:
  engine: '@midscene/web'
  steps:
    - id: open-orders
      instruction: Open the orders page.
      expect: The order list is visible.
    - id: submit-order
      instruction: Create an order using the prepared customer and default product.
      expect: A success message and the new order are visible.
snapshots:
  - name: before-create
    phase: before
  - name: after-create
    phase: after
artifacts:
  recording: artifacts/recordings/orders-create.v1
  results: artifacts/results
```

Required top-level fields are `schema_version`, `id`, `title`, `purpose`, `version`, `roles`, `business_flow`, `stable_node`, `natural_language`, `snapshots`, and `artifacts`. A fork increments `version`, sets `parent_version`, and leaves the source file unchanged.

The Node module exports `run({ page, expect, snapshot, context })`. Each deterministic step must map to a recorded business action. Keep the module executable without AI assistance.
