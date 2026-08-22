export async function runTransaction(steps) {
  const applied = [];
  const journal = [];
  try {
    for (const step of steps) {
      journal.push({ step: step.id, phase: "planned" });
      const evidence = await step.apply();
      applied.push(step);
      journal.push({ step: step.id, phase: "applied", evidence: evidence ?? null });
    }
    return { status: "complete", applied: applied.map((step) => step.id), rolled_back: [], retained: [], journal };
  } catch (error) {
    const rolledBack = [];
    const retained = [];
    for (const step of [...applied].reverse()) {
      try {
        const evidence = await step.rollback();
        rolledBack.push(step.id);
        journal.push({ step: step.id, phase: "rolled_back", evidence: evidence ?? null });
      } catch (rollbackError) {
        retained.push({ step: step.id, message: rollbackError.message });
        journal.push({ step: step.id, phase: "rollback_failed", message: rollbackError.message });
      }
    }
    return {
      status: retained.length ? "partial" : "rolled_back",
      error: error.message,
      applied: applied.map((step) => step.id),
      rolled_back: rolledBack,
      retained,
      journal,
    };
  }
}
