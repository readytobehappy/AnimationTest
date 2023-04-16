export interface Task {
  trigger?: string;
  action: (() => void) | (() => Promise<void>);
}

export function useTaskQueue (tasks: Task[], isLooped = false) {
  const triggers: Record<string, () => void> = {};

  const handleTrigger = (trigger: string) => {
    triggers[trigger]?.();
  };

  let taskIndex = 0;
  const startQueue = async () => {
    do {
      if (taskIndex >= tasks.length)
        taskIndex = 0;
      const task = tasks[taskIndex++];
      const triggerName = task.trigger;
      if (triggerName)
        await new Promise<void>(resolve => triggers[triggerName] = resolve);

      const result = task.action();
      if (result instanceof Promise)
        await result;
    } while (isLooped || taskIndex < tasks.length);
  };

  startQueue();

  return {
    handleTrigger
  };
}
