import { assertEquals, assertFalse } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { isWithinWorkflowAdvisorDailyLimit, isWithinWorkflowAdvisorRateLimit, WorkflowAdvisorSchema } from "./schema.ts";

Deno.test("workflow advisor requires a useful workflow description", () => {
  assertFalse(WorkflowAdvisorSchema.safeParse({ workflow: "Too short" }).success);
  assertEquals(WorkflowAdvisorSchema.safeParse({ workflow: "I manually reconcile orders from three sales channels every afternoon." }).success, true);
});

Deno.test("workflow advisor enforces the 3,000-character description limit", () => {
  assertFalse(WorkflowAdvisorSchema.safeParse({ workflow: "a".repeat(3001) }).success);
});

Deno.test("workflow advisor allows five requests per minute", () => {
  assertEquals(isWithinWorkflowAdvisorRateLimit(4), true);
  assertEquals(isWithinWorkflowAdvisorRateLimit(5), false);
});

Deno.test("workflow advisor allows three recommendations per UTC day", () => {
  assertEquals(isWithinWorkflowAdvisorDailyLimit(2), true);
  assertEquals(isWithinWorkflowAdvisorDailyLimit(3), false);
});